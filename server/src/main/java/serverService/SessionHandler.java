package serverService;

import org.apache.catalina.Manager;
import org.apache.catalina.Session;
import org.apache.catalina.session.StandardManager;
import org.hibernate.query.Query;

import javax.servlet.http.HttpSession;

public class SessionHandler {
    private static Manager manager = new StandardManager();

    public void addSession(HttpSession session) {
        manager.add((Session) session);
    }

    public void removeSession(HttpSession session) {
        manager.remove((Session) session);
    }

    public void updateDB(Query query) {

    }
}
