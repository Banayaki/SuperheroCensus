import dbService.entity.SuperheroesEntity;
import org.junit.Before;
import org.junit.Test;

import dbService.SessionExecutor;

import java.sql.SQLException;

import static org.junit.Assert.*;

public class DbTest {

//    Why i haven't suggestions?
//    short heroId, String heroName, String universe, byte power, String description,
//                             String isAlive, String imagePath, String phone
    SuperheroesEntity hero_1 = new SuperheroesEntity((short) -1, "pipec", "russia", (byte) 2, null, "Y", null,  null);
    SuperheroesEntity hero_2 = new SuperheroesEntity((short) -2, "AmericanMan", "usa", (byte) 19, null, "Y", null,  null);
    SuperheroesEntity hero_3 = new SuperheroesEntity((short) -3, "Dovakin", "tamriel", (byte) 40, null, "Y", null,  null);
    SuperheroesEntity hero_4 = new SuperheroesEntity((short) -4, "Geralt", "witcher", (byte) 80, null, "Y", null,  null);
    SuperheroesEntity hero_5 = new SuperheroesEntity((short) -5, "Soup", "cod", (byte) 50, null, "N", null,  null);
    SessionExecutor executor = new SessionExecutor();
    /*
        (\/) (;,,;) (\/)
     */
    @Test
    public void expressTestQueries() {
        try {
            executor.addNewHero(hero_1);
            System.out.println("Hero added successfully");
            assertEquals(executor.getById(hero_1.getHeroId()).getHeroId(), -1);
            System.out.println("Hero getById successfully");
            executor.deleteHero(hero_1);
            assertNull(executor.getById(hero_1.getHeroId()));
            System.out.println("Hero delete successfully");
        } catch (SQLException e) {
            e.printStackTrace();
        }

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
