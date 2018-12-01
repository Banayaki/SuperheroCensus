package dbService;

import dbService.entity.AbstractHeroEntity;
import dbService.entity.SuperheroesEntitySQLite;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.CallbackException;
import org.hibernate.Session;
import org.hibernate.Transaction;

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
    private SessionBuider sessionBuider;
    //    TODO Фабрика?
    private final Class heroEntity = SuperheroesEntitySQLite.class;

    public SessionExecutor() {
        sessionBuider = SessionBuider.getInstance();
    }

    public AbstractHeroEntity getByName(String name) throws SQLException {
        logger.info("Someone wanna get \"" + name + "\" from DB");
        AbstractHeroEntity hero;
        try (Session session = sessionBuider.openNewSession()) {
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

    public void addNewHero(AbstractHeroEntity hero) throws SQLException, CallbackException {
        String uniqMsg = "UNIQUE constraint failed";
        String foreignMsg = "FOREIGN KEY constraint failed";

        logger.info("Trying to add new hero \"" + hero.getHeroName() + "\"");
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.save(heroEntity.cast(hero));
            tx.commit();
            logger.info("New hero was added");
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.error("Hero doesn't add " + ex.getMessage());
            if (tx != null) tx.rollback();

            if (ex.getCause().getCause().getMessage().contains(uniqMsg)) {
                throw new CallbackException(uniqMsg);
            } else if (ex.getCause().getCause().getMessage().contains(foreignMsg)) {
                throw new CallbackException(foreignMsg);
            }
        }
    }

    public void deleteHero(String heroName) throws SQLException {
        logger.info("Trying to delete " + heroName);
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
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

    public void changeHero(AbstractHeroEntity hero) throws SQLException {
        logger.info("Trying to change " + hero.getHeroName());
        Transaction tx = null;
        try (Session session = sessionBuider.openNewSession()) {
            tx = session.beginTransaction();
            session.update(heroEntity.cast(hero));
            tx.commit();
            logger.info("Successful change " + hero.getHeroName());
        } catch (Exception ex) {
            logger.error("Hero doesn't change, because " + ex.getMessage());
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            String errorMsg = "Row was updated or deleted by another transaction";
            if (ex.getMessage().contains(errorMsg)) {
                throw new CallbackException(errorMsg);
            }
        }
    }

    @Override
    public void hardUpdateTable(List<AbstractHeroEntity> heroes) throws SQLException {
        logger.info("Trying to hardUpdate table");
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
        try (Session session = sessionBuider.openNewSession()) {
            list = session.createQuery("FROM " + heroEntity.getCanonicalName()).list();
            logger.info("Hero list successfully received");
        } catch (Exception ex) {
            logger.error("Hero list doesn't received, because " + ex.getMessage());
            ex.printStackTrace();
        }
        return list;
    }
}
