package serverService.servlets;

import dbService.SessionExecutor;
import dbService.entity.SuperheroesEntity;
import org.json.simple.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@SuppressWarnings("unchecked")
public class OnLoadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        SessionExecutor executor = new SessionExecutor();
        System.out.println("adasddas");
        List heroes = null;
        try {
            heroes = executor.getHeroesList();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        JSONObject json = new JSONObject();
        for (Object entity : heroes) {
            SuperheroesEntity hero = (SuperheroesEntity) entity;
            JSONObject hero_obj = new JSONObject();

            // TODO сделать это симпотичнее
            hero_obj.put("image_path", hero.getImagePath());
            hero_obj.put("universe", hero.getUniverse());
            hero_obj.put("power", hero.getPower());
            hero_obj.put("desc", hero.getDescription());
            hero_obj.put("alive", hero.getIsAlive());
            hero_obj.put("phone", hero.getPhone());

            json.put(hero.getHeroName(), hero_obj);
        }
        resp.getWriter().write(json.toJSONString());
    }
}
