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
                    .createQuery("select h from SuperheroesEntity h where h.heroName like :name")
                    .setParameter("name", name)
                    .getSingleResult();
        }
        return hero;
    }

    @SuppressWarnings("Duplicates")
    public void addNewHero(SuperheroesEntity hero) throws SQLException {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.save(hero);
            session.flush();
            tx.commit();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (tx != null) tx.rollback();
        }

    }

    public void deleteHero(SuperheroesEntity hero) throws SQLException {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.delete(hero);
            session.flush();
            tx.commit();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (tx != null) tx.rollback();
        }

    }

    @SuppressWarnings("Duplicates")
    public void changeHero(SuperheroesEntity hero) throws SQLException {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.update(hero);
            tx.commit();
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
        }


    }

    public List getHeroesList() throws SQLException {
        List list = null;
        try (Session session = sessionBuider.openNewSession()) {
            list = session.createQuery("FROM SuperheroesEntity ").list();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }

    public void destroy() {
        sessionIdFactory.decrementAndGet();
    }
}
