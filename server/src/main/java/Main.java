import dbService.SessionExecutor;
import dbService.entity.SuperheroesEntity;

import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) throws SQLException, ClassNotFoundException, IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
        SessionExecutor executor = new SessionExecutor();
        SuperheroesEntity hero = new SuperheroesEntity((short) 1, "Batman", "DC", (byte) 99, null, "Y", null, null);
        executor.addNewHero(hero);
        List allHeroesList = executor.getHeroesList();
        System.out.println(allHeroesList);
        hero = executor.getById((short) 1);
        System.out.println(hero);
        hero = executor.getByName("Batman");
        System.out.println(hero);
        SuperheroesEntity newHero = new SuperheroesEntity((short) 2, "IronMan", "Marvel", (byte) 100, "Buisnesman", "Y", null, null);
        executor.deleteHero(hero);
        executor.addNewHero(newHero);
    }
}
