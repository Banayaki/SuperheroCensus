package dbService;

import dbService.entity.SuperheroesEntity;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import java.sql.SQLException;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

public class SessionExecutor implements UserDAO {
    private SessionFactory sessionFactory;
    private static AtomicInteger sessionIdFactory = new AtomicInteger(1);
    private Integer sessionId;

    public SessionExecutor() {
        sessionId = sessionIdFactory.getAndIncrement();

        Configuration conf = new Configuration()
                .addResource("hibernate.cfg.xml")
                .addResource("SuperheroesEntity.hbm.xml");

        StandardServiceRegistryBuilder serviceRegistryBuilder = new StandardServiceRegistryBuilder();
        serviceRegistryBuilder.applySettings(conf.getProperties());
        ServiceRegistry serviceRegistry = serviceRegistryBuilder.build();

        sessionFactory = conf.buildSessionFactory(serviceRegistry);
    }


    public SuperheroesEntity getById(short id) throws SQLException {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
        }

        return null;
    }

    public SuperheroesEntity getByName(String name) throws SQLException {
        return null;
    }

    public void addNewHero(SuperheroesEntity hero) throws SQLException {

    }

    public void deleteHero(SuperheroesEntity hero) throws SQLException {

    }

    public void changeHero(SuperheroesEntity hero) throws SQLException {

    }

    public Set<SuperheroesEntity> getTable() throws SQLException {

        return null;
    }
}
