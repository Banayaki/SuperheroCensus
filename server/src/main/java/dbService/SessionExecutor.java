package dbService;

import dbService.entity.AbstractHeroEntity;
import dbService.entity.SuperheroesEntityOracle;
import dbService.entity.SuperheroesEntitySQLite;
import org.hibernate.Session;
import org.hibernate.Transaction;

import javax.persistence.NoResultException;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class SessionExecutor implements UserDAO {
    private SessionBuider sessionBuider;
    private static AtomicInteger sessionIdFactory = new AtomicInteger(1);
    // TODO замена класса
    private final Class heroEntity = SuperheroesEntitySQLite.class;
    private Integer sessionId;

    public SessionExecutor() {
        sessionId = sessionIdFactory.getAndIncrement();
        sessionBuider = SessionBuider.getInstance();
    }

    public AbstractHeroEntity getByName(String name) throws SQLException {
        AbstractHeroEntity hero;
        try (Session session = sessionBuider.openNewSession()) {
            hero = (AbstractHeroEntity) session
                    .createQuery("select h from " + heroEntity.getCanonicalName() + " h where h.heroName like :name")
                    .setParameter("name", name)
                    .getSingleResult();
        } catch (NoResultException ex) {
            return null;
        }
        return hero;
    }

    @SuppressWarnings("Duplicates")
    public void addNewHero(AbstractHeroEntity hero) throws SQLException {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.save(heroEntity.cast(hero));
            session.flush();
            tx.commit();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (tx != null) tx.rollback();
        }

    }

    public void deleteHero(String heroName) throws SQLException {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session
                    .createQuery("DELETE FROM " + heroEntity.getCanonicalName() + " h WHERE h.heroName like :name")
                    .setParameter("name", heroName)
                    .executeUpdate();
            session.flush();
            tx.commit();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (tx != null) tx.rollback();
        }

    }

    @SuppressWarnings("Duplicates")
    public void changeHero(AbstractHeroEntity hero) throws SQLException {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.update(heroEntity.cast(hero));
            tx.commit();
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
        }


    }

    public void hardUpdateTable(List<AbstractHeroEntity> heroes) {
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session
                    .createQuery("DELETE FROM SuperheroesEntitySQLite ")
                    .executeUpdate();
            for (AbstractHeroEntity hero : heroes) {
                session.save(hero);
            }
            tx.commit();
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
        }
    }

    public List getHeroesList() throws SQLException {
        List list = null;
        try (Session session = sessionBuider.openNewSession()) {
            list = session.createQuery("FROM " + heroEntity.getCanonicalName()).list();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }

    public void destroy() {
        sessionIdFactory.decrementAndGet();
    }
}
