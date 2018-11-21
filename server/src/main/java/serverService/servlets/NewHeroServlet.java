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

public class NewHeroServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        SessionExecutor sessionExecutor = new SessionExecutor();
        response.setContentType("text/html;charset=utf-8");

        StringBuilder stringBuilder = new StringBuilder();
        String line = null;
        BufferedReader reader = request.getReader();
        while (( line = reader.readLine()) != null)
            stringBuilder.append(line);

        //TODO выбор реализации
        AbstractHeroEntity hero = new SuperheroesEntitySQLite();
        try {
            JSONObject jsonObject = new JSONObject(stringBuilder.toString());
            hero.setHeroName(jsonObject.getString("heroname"));
            hero.setDescription(jsonObject.getString("desc"));
            hero.setImagePath(jsonObject.getString("image_path"));
            hero.setUniverse(jsonObject.getString("universe"));
            hero.setIsAlive(jsonObject.getString("alive"));
            hero.setPhone(jsonObject.getString("phone"));
            hero.setPower(Byte.parseByte(jsonObject.getString("power")));
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        try {
            sessionExecutor.addNewHero(hero);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}