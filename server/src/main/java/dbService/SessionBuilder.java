package dbService;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class SessionBuilder {
    private static SessionBuilder instance = new SessionBuilder();
    private final SessionFactory sessionFactory;

    public static SessionBuilder getInstance() {
        return instance;
    }

    private SessionBuilder() {
        Configuration config = new Configuration()
                .addResource("hibernate.cfg.xml")
                .addResource("SuperheroesEntitySQLite.hbm.xml")
                .addResource("UniversesList.hbm.xml")
                .addResource("Boolstates.hbm.xml")
                .configure();
        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                .applySettings(config.getProperties())
                .build();

        sessionFactory = config.buildSessionFactory(serviceRegistry);
    }

    public Session openNewSession() {

        Session session;
        if (sessionFactory.isClosed()) {
            session = sessionFactory.openSession();
        } else {
            session = sessionFactory.getCurrentSession();
        }
        return session;
    }
}
