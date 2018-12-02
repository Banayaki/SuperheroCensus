import dbService.entity.AbstractHeroEntity;
import dbService.entity.SuperheroesEntityOracle;
import dbService.entity.SuperheroesEntitySQLite;
import org.junit.Test;

import dbService.SessionExecutor;

import java.sql.SQLException;

import static org.junit.Assert.*;

public class DbTest {

//    Why i haven't suggestions?
//    short heroId, String heroName, String universe, byte power, String description,
//                             String isAlive, String imagePath, String phone
//    AbstractHeroEntity hero_1 = new SuperheroesEntitySQLite((short) -1, "pipec", "russia", (byte) 2, null, "Y", null,  null);
//    AbstractHeroEntity hero_2 = new SuperheroesEntitySQLite((short) -2, "AmericanMan", "usa", (byte) 19, null, "Y", null,  null);
//    AbstractHeroEntity hero_3 = new SuperheroesEntitySQLite((short) -3, "Dovakin", "tamriel", (byte) 40, null, "Y", null,  null);
//    AbstractHeroEntity hero_4 = new SuperheroesEntitySQLite((short) -4, "Geralt", "witcher", (byte) 80, null, "Y", null,  null);
//    AbstractHeroEntity hero_5 = new SuperheroesEntitySQLite((short) -5, "Soup", "cod", (byte) 50, null, "N", null,  null);
//    SessionExecutor executor = new SessionExecutor();
    /*
        (\/) (;,,;) (\/)
     */
    @Test
    public void expressTestQueries() {
//        try {
//            executor.addNewHero(hero_1);
//            System.out.println("Hero added successfully");
//            assertEquals(executor.getByName(hero_1.getHeroName()).getHeroName(), hero_1.getHeroName());
//            System.out.println("Hero getByName successfully");
//            executor.deleteHero("pipec");
//            assertNull(executor.getByName(hero_1.getHeroName()));
//            System.out.println("Hero delete successfully");
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }

    }

    @Test
    public void testAddStmt() {

    }

    @Test
    public void testDeleteStmt() {

    }

    @Test
    public void testUpdateStmt() {

    }

    @Test
    public void testSelectStmt() {

    }
}
