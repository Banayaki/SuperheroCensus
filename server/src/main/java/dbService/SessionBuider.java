package dbService;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class SessionBuider {
    private static SessionBuider instance = new SessionBuider();
    private final SessionFactory sessionFactory;

    public static SessionBuider getInstance() {
        return instance;
    }

    private SessionBuider() {
        Configuration config = new Configuration()
                .addResource("hibernate.cfg.xml")
                .addResource("SuperheroesEntity.hbm.xml")
                .configure();
        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                .applySettings(config.getProperties())
                .build();

        sessionFactory = config.buildSessionFactory(serviceRegistry);
    }

    public Session openNewSession() {
        return sessionFactory.openSession();
    }
}
