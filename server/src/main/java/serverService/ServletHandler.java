package serverService;

import dbService.SessionExecutor;
import dbService.entity.AbstractHeroEntity;
import dbService.entity.BooleanStateEntity;
import dbService.entity.SuperheroesEntitySQLite;
import dbService.entity.UniverseEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.CallbackException;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * Основной используемы в приложении сервлет.
 * Подразумевает наличие переданного параметра "action"
 * "load" - отправляет серверу ответом все карточки, полученные из БД
 * "change" - изменяет персонажа в БД
 * "delete" - удаление персонажа из БД
 * "add" - добавление персонажа в БД
 * "hardUpdate" - удаляет всех героев из БД и добавляет новых
 */
@SuppressWarnings("unused")
@WebServlet(name = "ServletHandler", urlPatterns = {"/doAction"})
public class ServletHandler extends HttpServlet {
    private static Logger logger = LogManager.getLogger();
    private SessionExecutor executor;
    private HttpServletResponse response;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.response = resp;
        resp.setStatus(HttpServletResponse.SC_OK);

        executor = new SessionExecutor();
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        String action = null;
        BufferedReader reader = req.getReader();

        while ((line = reader.readLine()) != null)
            stringBuilder.append(line);

        try {
            JSONObject json = new JSONObject(stringBuilder.toString());
            action = json.getString("action");
            Object param = null;
            if (json.has("data")) {
                param = json.get("data");
            }

            logger.info("POST Request, on /doAction with action: " + action);

            Object returnValue = invokeMethod(action, param);
            if (returnValue != null) {
                resp.getWriter().write(returnValue.toString());
            }

        } catch (Exception ex) {
            String uniqMsg = "UNIQUE constraint failed";
            String foreignMsg = "transient instance must be saved before";
            String conflictMsg = "Row was updated or deleted by another transaction";

            StringBuilder errorMsgBuilder = new StringBuilder();
            Throwable throwable = ex;
            while (throwable != null) {
                errorMsgBuilder.append(throwable.getMessage());
                throwable = throwable.getCause();
            }
            String msg = errorMsgBuilder.toString();
            logger.error("Error on " + action + " " + msg);


            // TODO error handler
            if (msg.contains(uniqMsg)) {
                logger.error(uniqMsg);
                resp.getWriter().write(uniqMsg);
            } else if (msg.contains(foreignMsg)) {
                logger.error("Unknown universe error");
                resp.getWriter().write("Unknown universe error. Available universes: " + getUniverses() +
                        " or you're trying to change deleted card");
            } else if (msg.contains(conflictMsg)) {
                logger.error(conflictMsg);
                resp.getWriter().write(conflictMsg);
            } else {
                resp.getWriter().write(ex.toString());
            }
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
        }
    }

    private JSONObject doLoad() throws SQLException {
        List heroes = this.executor.getHeroesList();
        JSONObject json = new JSONObject();
        for (Object entity : heroes) {
            AbstractHeroEntity hero = (AbstractHeroEntity) entity;
            JSONObject heroJson = new JSONObject();

            heroJson.put("image_path", hero.getImagePath());
            heroJson.put("universe", hero.getUniverse().toString());
            heroJson.put("power", hero.getPower());
            heroJson.put("desc", hero.getDescription());
            heroJson.put("alive", hero.getIsAlive().toString().equals("Y") ? "checked" : "");
            heroJson.put("phone", hero.getPhone());

            json.put(hero.getHeroName(), heroJson);
        }
        return json;
    }

    private void doChange(JSONArray json) throws SQLException, IOException {
        executor.changeHero(createHeroesFromJSONArray(json));
    }

    private void doDelete(String heroName) throws SQLException {
        executor.deleteHero(heroName);
    }

    private void doAdd(JSONArray json) throws SQLException {
        executor.addNewHero(createHeroesFromJSONArray(json));
    }

    private String doGetUniverses() throws Exception {
        return getUniverses();
    }

    private String getUniverses() {
        return executor.getUniverseList();
    }


    private List<AbstractHeroEntity> createListOfHeroes(JSONObject json) {
        List<AbstractHeroEntity> heroList = new LinkedList<>();

        for (Iterator iter = json.keys(); iter.hasNext(); ) {
            String key = (String) iter.next();
            JSONObject heroJson = json.getJSONObject(key);
            heroList.add(createHeroFromJSON(heroJson, key));
        }
        return heroList;
    }

    private List<AbstractHeroEntity> createHeroesFromJSONArray(JSONArray jsonArray) {
        List<AbstractHeroEntity> heroList = new LinkedList<>();
        for (Object heroJson: jsonArray) {
            heroList.add(createHeroFromJSON((JSONObject) heroJson));
        }
        return heroList;
    }

    private AbstractHeroEntity createHeroFromJSON(JSONObject json, String heroName) {
        json.put("heroname", heroName);
        return createHeroFromJSON(json);
    }

    private AbstractHeroEntity createHeroFromJSON(JSONObject json) {
        AbstractHeroEntity hero = new SuperheroesEntitySQLite();

        hero.setHeroName(json.getString("heroname"));
        hero.setDescription(json.getString("desc"));
        hero.setImagePath(json.getString("image_path"));
        hero.setUniverse(new UniverseEntity(json.getString("universe")));
        hero.setIsAlive(new BooleanStateEntity(json.getString("alive")));
        hero.setPhone(json.getString("phone"));
        hero.setPower((byte) json.getInt("power"));

        return hero;
    }


    private Object invokeMethod(String action, Object param) throws Exception {
        Object returnValue;

        if (param == null) {
            Method callingMethod = this.getClass().getDeclaredMethod("do".concat(action));
            returnValue = callingMethod.invoke(this);
        } else {
            Method callingMethod = this.getClass().getDeclaredMethod("do".concat(action), param.getClass());
            returnValue = callingMethod.invoke(this, param.getClass().cast(param));
        }
        return returnValue;
    }

}
