package serverService.servlets;

import dbService.SessionExecutor;
import dbService.entity.AbstractHeroEntity;
import dbService.entity.SuperheroesEntitySQLite;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class ServletHandler extends HttpServlet {
    private SessionExecutor executor;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        executor = new SessionExecutor();
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        BufferedReader reader = req.getReader();

        while ((line = reader.readLine()) != null)
            stringBuilder.append(line);

        try {
            JSONObject json = new JSONObject(stringBuilder.toString());
            String action = json.getString("action");

            switch (action) {
                case "load":
                    String result = doLoad().toString(4);
                    resp.getWriter().write(result);
                    break;
                case "change":
                    doChange(json.getJSONObject("data"));
                    break;
                case "delete":
                    doDelete(json.getString("data"));
                    break;
                case "add":
                    doAdd(json.getJSONObject("data"));
                    break;
                default:
                    throw new UnsupportedOperationException();
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

    private JSONObject doLoad() throws SQLException {
        List heroes = this.executor.getHeroesList();
        JSONObject json = new JSONObject();
        for (Object entity : heroes) {
            AbstractHeroEntity hero = (AbstractHeroEntity) entity;
            JSONObject heroJson = new JSONObject();

            heroJson.put("image_path", hero.getImagePath());
            heroJson.put("universe", hero.getUniverse());
            heroJson.put("power", hero.getPower());
            heroJson.put("desc", hero.getDescription());
            heroJson.put("alive", hero.getIsAlive());
            heroJson.put("phone", hero.getPhone());

            json.put(hero.getHeroName(), heroJson);
        }
        return json;
    }

    private void doChange(JSONObject json) throws SQLException {
        executor.changeHero(createHeroFromJSON(json));
    }

    private void doDelete(String heroName) throws SQLException {
        executor.deleteHero(heroName);
    }

    private void doAdd(JSONObject json) throws SQLException {
        executor.addNewHero(createHeroFromJSON(json));
    }

    private AbstractHeroEntity createHeroFromJSON(JSONObject json) {
        AbstractHeroEntity hero = new SuperheroesEntitySQLite();

        hero.setHeroName(json.getString("heroname"));
        hero.setDescription(json.getString("desc"));
        hero.setImagePath(json.getString("image_path"));
        hero.setUniverse(json.getString("universe"));
        hero.setIsAlive(json.getString("alive"));
        hero.setPhone(json.getString("phone"));
        hero.setPower(Byte.parseByte(json.getString("power")));

        return hero;
    }
}
