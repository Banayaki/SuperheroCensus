package serverService.servlets;

import org.apache.tomcat.util.json.JSONParser;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class NewHeroServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        String dataJson = request.getParameter("data");

        JSONParser parser = new JSONParser(dataJson);

        System.out.println(dataJson);
    }
}
