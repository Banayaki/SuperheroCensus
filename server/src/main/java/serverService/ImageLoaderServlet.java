package serverService;

import org.json.JSONObject;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Collection;

@WebServlet(name = "ImageLoader", urlPatterns = {"/doLoad"})
@MultipartConfig
public class ImageLoaderServlet extends HttpServlet {
    private final String PATH = "/home/banayaki/Desktop/NetCracker/NC Projects/SuperheroCensus/server/web/img/";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String filename = req.getParameter("name");
            Part imageFileUploader = req.getPart("file");

            BufferedImage image = ImageIO.read(imageFileUploader.getInputStream());
            String format = "jpg";
            File file = new File(PATH + filename + "." + format);
            ImageIO.write(image, format, file);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
