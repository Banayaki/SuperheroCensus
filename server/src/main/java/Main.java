import dbService.SessionExecutor;
import dbService.entity.SuperheroesEntity;

import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) throws SQLException, ClassNotFoundException, IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
        SessionExecutor executor = new SessionExecutor();
        SuperheroesEntity hero;
        List allHeroesList = executor.getTable();
        System.out.println(allHeroesList);
        hero = executor.getById((short) 1);
        System.out.println(hero);
        hero = executor.getByName("Batman");
        System.out.println(hero);
    }
}
