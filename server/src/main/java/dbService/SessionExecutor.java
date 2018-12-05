package dbService;

import dbService.entity.AbstractHeroEntity;
import dbService.entity.SuperheroesEntitySQLite;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.CallbackException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import javax.persistence.NoResultException;
import java.sql.SQLException;
import java.util.List;

/**
 * Класс реализующий работу с БД
 *
 * @see UserDAO
 */
@SuppressWarnings({"RedundantThrows", "TryFinallyCanBeTryWithResources"})
public class SessionExecutor implements UserDAO {
    private static Logger logger = LogManager.getLogger();
    private SessionBuilder sessionBuilder;
    //    TODO Фабрика?
    private final Class heroEntity = SuperheroesEntitySQLite.class;

    public SessionExecutor() {
        sessionBuilder = SessionBuilder.getInstance();
    }

    public AbstractHeroEntity getByName(String name) throws SQLException {
        logger.info("Someone wanna get \"" + name + "\" from DB");
        AbstractHeroEntity hero;
        try (Session session = sessionBuilder.openNewSession()) {
            hero = (AbstractHeroEntity) session
                    .createQuery("select h from " + heroEntity.getCanonicalName() + " h where h.heroName like :name")
                    .setParameter("name", name)
                    .getSingleResult();
            logger.info("Get hero");
        } catch (NoResultException ex) {
            logger.error("This hero doesn't exist");
            return null;
        }
        return hero;
    }

    public void addNewHero(List<AbstractHeroEntity> heroList) throws SQLException {
        logger.info("Trying to add new heroes");
        Transaction tx = null;
        Session session = null;
        try {
            session = sessionBuilder.openNewSession();
            tx = session.beginTransaction();
            for (AbstractHeroEntity hero: heroList) {
                session.save(heroEntity.cast(hero));
            }
            tx.commit();
            logger.info("New hero was added");
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            throw ex;
        } finally {
            if (session != null) session.close();
        }
    }

    public void deleteHero(String heroName) throws SQLException {
        logger.info("Trying to delete " + heroName);
        Transaction tx = null;
        Session session = null;
        try {
            session = sessionBuilder.openNewSession();
            tx = session.beginTransaction();
            session
                    .createQuery("DELETE FROM " + heroEntity.getCanonicalName() + " h WHERE h.heroName like :name")
                    .setParameter("name", heroName)
                    .executeUpdate();
            tx.commit();
            logger.info("Successful delete " + heroName);
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            throw ex;

        } finally {
            if (session != null) session.close();
        }
    }

    public void changeHero(List<AbstractHeroEntity> heroList) throws SQLException {
        logger.info("Trying to change " + heroList.size() + " heroes");
        int countOfChanged = 0;
        Transaction tx = null;
        Session session = null;
        try {
            session = sessionBuilder.openNewSession();
            tx = session.beginTransaction();
            Query query = session.createQuery("update SuperheroesEntitySQLite set" +
                    " description = :description," +
                    " power = :power," +
                    " phone = :phone," +
                    " universe = :universe," +
                    " isAlive = :alive " +
                    " where heroName = :name and " +
                    ":alive IN (select bool_state from BooleanStateEntity) and " +
                    ":universe IN (select universe_name from UniverseEntity )");

            for (AbstractHeroEntity hero: heroList) {
//                Why it doesn't work???
//                session.update(heroEntity.cast(hero));
                logger.debug("Changing the hero: " + hero.toString());
                countOfChanged += query
                        .setParameter("alive", hero.getIsAlive())
                        .setParameter("universe", hero.getUniverse())
                        .setParameter("description", hero.getDescription())
                        .setParameter("phone", hero.getPhone())
                        .setParameter("power", hero.getPower())
                        .setParameter("name", hero.getHeroName())
                        .executeUpdate();
            }
            logger.debug("Changed " + countOfChanged + " heroes");
            if (countOfChanged != heroList.size()) {
                throw new SQLException("transient instance must be saved before");
            }
            tx.commit();
            logger.info("Successful changes");
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            throw ex;

        } finally {
            if (session != null) session.close();
        }
    }

    @Override
    public List getHeroesList() throws SQLException {
        logger.info("Trying to get hero list");
        List list = null;
        Transaction tx;
        Session session = null;
        try {
            session = sessionBuilder.openNewSession();
            tx = session.beginTransaction();
            list = session.createQuery("FROM " + heroEntity.getCanonicalName()).list();
            tx.commit();
            logger.info("Hero list successfully received");
        } catch (Exception ex) {
            throw ex;
        }finally {
            if (session != null) session.close();
        }
        return list;
    }

    private String getRootCause(Throwable ex) {
        Throwable cause = ex;
        while (ex.getCause() != null) {
            cause = cause.getCause();
        }
        return cause.getMessage();
    }

    public String getUniverseList() {
        List listOfUniverses;
        String result = "";
        Session session = null;
        try {
            session = sessionBuilder.openNewSession();
            Transaction helperTx = session.beginTransaction();
            listOfUniverses = session
                    .createQuery("select universe_name from UniverseEntity ").list();
            helperTx.commit();
            result = listOfUniverses.toString();
        } finally {
            if (session != null) session.close();
        }
        return result;
    }
}
