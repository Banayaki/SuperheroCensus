package dbService;

import dbService.entity.SuperheroesEntity;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class SessionExecutor implements UserDAO {
    private SessionBuider sessionBuider;
    private static AtomicInteger sessionIdFactory = new AtomicInteger(1);
    private Integer sessionId;

    public SessionExecutor() {
        sessionId = sessionIdFactory.getAndIncrement();
        sessionBuider = SessionBuider.getInstance();
    }


    public SuperheroesEntity getById(short id) throws SQLException {
        SuperheroesEntity hero;
        try (Session session = sessionBuider.openNewSession()) {
            hero = session.get(SuperheroesEntity.class, id);
        }
        return hero;
    }

    public SuperheroesEntity getByName(String name) throws SQLException {
        SuperheroesEntity hero;
        try (Session session = sessionBuider.openNewSession()) {
            hero = (SuperheroesEntity) session
                    .createNativeQuery("SELECT * FROM SUPERHEROCENSUS.SUPERHEROES h WHERE h.HERO_NAME = " + name)
                    .getSingleResult();
        }
        return hero;
    }

    public void addNewHero(SuperheroesEntity hero) throws SQLException {
        try (Session session = sessionBuider.openNewSession()) {
            Transaction transaction = session.beginTransaction();
        }

    }

    public void deleteHero(SuperheroesEntity hero) throws SQLException {
        try (Session session = sessionBuider.openNewSession()) {
            Transaction transaction = session.beginTransaction();
        }

    }

    public void changeHero(SuperheroesEntity hero) throws SQLException {
        try (Session session = sessionBuider.openNewSession()) {
            Transaction transaction = session.beginTransaction();
        }

    }

    public List getTable() throws SQLException {
        List list = null;
        try (Session session = sessionBuider.openNewSession()) {
            list = session.createQuery("FROM SuperheroesEntity ").list();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }
}
