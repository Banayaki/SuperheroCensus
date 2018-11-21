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
import java.util.Iterator;

public class DeleteHeroServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionExecutor sessionExecutor = new SessionExecutor();

        StringBuilder stringBuilder = new StringBuilder();
        String line = null;
        BufferedReader reader = request.getReader();
        while (( line = reader.readLine()) != null)
            stringBuilder.append(line);

        //TODO выбор реализации
        AbstractHeroEntity hero = null;
        try {
            JSONObject jsonObject = new JSONObject(stringBuilder.toString());
            for (Iterator<String> it = jsonObject.keys(); it.hasNext(); ) {
                hero = new SuperheroesEntitySQLite();

                String heroName = it.next();
                JSONObject jsonHero = jsonObject.getJSONObject(heroName);
                hero.setHeroName(heroName);
                hero.setDescription(jsonHero.getString("desc"));
                hero.setImagePath(jsonHero.getString("image_path"));
                hero.setUniverse(jsonHero.getString("universe"));
                hero.setIsAlive(jsonHero.getString("alive"));
                hero.setPhone(jsonHero.getString("phone"));
                hero.setPower(Byte.parseByte(jsonHero.getString("power")));

                sessionExecutor.deleteHero(hero);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }
}
