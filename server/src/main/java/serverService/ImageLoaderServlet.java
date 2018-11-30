package serverService;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@WebServlet(name = "ImageLoader", urlPatterns = {"/doLoad"})
@MultipartConfig
public class ImageLoaderServlet extends HttpServlet {
    private final String PATH = "/home/banayaki/Desktop/NetCracker/NC Projects/SuperheroCensus/out/artifacts/server_war_exploded/img/";
    private static Logger logger = LogManager.getLogger();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            logger.info("POST Request, on /doLoad");
            String filename = req.getParameter("name");
            Part imageFileUploader = req.getPart("file");

            BufferedImage image = ImageIO.read(imageFileUploader.getInputStream());
            String format = "jpg";
            File file = new File(PATH + filename + "." + format);
            ImageIO.write(image, format, file);
            logger.info("Image successfully uploaded");
        } catch (Exception ex) {
            logger.error("Error on loadImage: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
