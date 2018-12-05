package dbService;

import dbService.entity.AbstractHeroEntity;

import java.sql.SQLException;
import java.util.List;

public interface UserDAO {

    AbstractHeroEntity getByName(String name) throws SQLException;

    void addNewHero(List<AbstractHeroEntity> heroList) throws SQLException;

    void deleteHero(String heroName) throws SQLException;

    void changeHero(List<AbstractHeroEntity> heroList) throws SQLException;

    List getHeroesList() throws SQLException;

    void hardUpdateTable(List<AbstractHeroEntity> list) throws SQLException;
}
