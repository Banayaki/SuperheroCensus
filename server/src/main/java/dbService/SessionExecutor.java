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
@SuppressWarnings("RedundantThrows")
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

    public void addNewHero(List<AbstractHeroEntity> heroList) throws SQLException, CallbackException {
        String uniqMsg = "UNIQUE constraint failed";
        String foreignMsg = "transient instance must be saved before";

        logger.info("Trying to add new heroes");
        Transaction tx = null;
        try (Session session = sessionBuilder.openNewSession()) {
            tx = session.beginTransaction();
            for (AbstractHeroEntity hero: heroList) {
                session.save(heroEntity.cast(hero));
            }
            tx.commit();
            logger.info("New hero was added");
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.error("Hero doesn't add, because: " + ex.getMessage());

            if (getRootCause(ex).contains(uniqMsg)) {
                if (tx != null) tx.rollback();
                throw new CallbackException(uniqMsg);
            } else if (getRootCause(ex).contains(foreignMsg)) {
                throw new CallbackException("Unknown universe. I know only " + getUniverseList());
            }
        }
    }

    public void deleteHero(String heroName) throws SQLException {
        logger.info("Trying to delete " + heroName);
        Transaction tx = null;
        try (Session session = sessionBuilder.openNewSession()) {
            tx = session.beginTransaction();
            session
                    .createQuery("DELETE FROM " + heroEntity.getCanonicalName() + " h WHERE h.heroName like :name")
                    .setParameter("name", heroName)
                    .executeUpdate();
            tx.commit();
            logger.info("Successful delete " + heroName);
        } catch (Exception ex) {
            logger.error("Hero doesn't delete " + ex.getMessage());
            ex.printStackTrace();
            if (tx != null) tx.rollback();
        }
    }

    public void changeHero(List<AbstractHeroEntity> heroList) throws SQLException {
        logger.info("Trying to change " + heroList.size() + " heroes");
        int countOfChanged = 0;
        Transaction tx = null;
        try (Session session = sessionBuilder.openNewSession()) {
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
                logger.debug("Adding the hero: " + hero.toString());
                countOfChanged = query
                        .setParameter("alive", hero.getIsAlive())
                        .setParameter("universe", hero.getUniverse())
                        .setParameter("description", hero.getDescription())
                        .setParameter("phone", hero.getPhone())
                        .setParameter("power", hero.getPower())
                        .setParameter("name", hero.getHeroName())
                        .executeUpdate();
            }
            logger.debug("Changed " + countOfChanged + " heroes");
            tx.commit();
            if (countOfChanged != heroList.size()) {
                throw new SQLException("Unknown universe");
            }
            logger.info("Successful changes");
        } catch (Exception ex) {
            logger.error("Hero doesn't change, because " + ex.getMessage());
            if (tx != null) tx.rollback();
            String errorMsg = "Row was updated or deleted by another transaction";
            if (ex.getMessage().contains(errorMsg)) {
                throw new CallbackException(errorMsg);
            } else if (ex.getMessage().contains("Unknown universe")) {

                throw new CallbackException("Unknown universe. I know only " + getUniverseList());
            }
        }
    }

    @Override
    public void hardUpdateTable(List<AbstractHeroEntity> heroes) throws SQLException {
        logger.info("Trying to hardUpdate table");
        Transaction tx = null;
        try (Session session = sessionBuilder.openNewSession()) {
            tx = session.beginTransaction();
            session
                    .createQuery("DELETE FROM SuperheroesEntitySQLite ")
                    .executeUpdate();
            for (AbstractHeroEntity hero : heroes) {
                session.save(hero);
            }
            tx.commit();
            logger.info("HardUpdate Success");
        } catch (Exception ex) {
            logger.error("hardUpdate doesn't happen " + ex.getMessage());
            if (tx != null) tx.rollback();
            ex.printStackTrace();
        }
    }

    public List getHeroesList() throws SQLException {
        logger.info("Trying to get hero list");
        List list = null;
        Transaction tx;
        try (Session session = sessionBuilder.openNewSession()) {
            tx = session.beginTransaction();
            list = session.createQuery("FROM " + heroEntity.getCanonicalName()).list();
            tx.commit();
            logger.info("Hero list successfully received");
        } catch (Exception ex) {
            logger.error("Hero list doesn't received, because " + ex.getMessage());
            ex.printStackTrace();
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

    private String getUniverseList() {
        List listOfUniverses;
        String result = "";
        try (Session session = sessionBuilder.openNewSession()) {
            Transaction helperTx = session.beginTransaction();
            listOfUniverses = session
                    .createQuery("select universe_name from UniverseEntity ").list();
            helperTx.commit();
            result = listOfUniverses.toString();
        } catch (Exception ex) {
            logger.error("Something bad with universe table");
        }
        return result;
    }
}
