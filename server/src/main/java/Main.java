import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) throws SQLException, ClassNotFoundException, IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
        Connection connection = null;
        DriverManager.registerDriver((Driver) Class.forName("oracle.jdbc.driver.OracleDriver")
                .getDeclaredConstructor()
                .newInstance());
        connection = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:XE","SYSTEM","0102");

    }
}
