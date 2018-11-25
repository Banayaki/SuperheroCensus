package dbService;

import dbService.entity.AbstractHeroEntity;
import dbService.entity.SuperheroesEntityOracle;

import java.sql.SQLException;
import java.util.List;

public interface UserDAO {

    AbstractHeroEntity getByName(String name) throws SQLException;

    void addNewHero(AbstractHeroEntity hero) throws SQLException;

    void deleteHero(String heroName) throws SQLException;

    void changeHero(AbstractHeroEntity hero) throws SQLException;

    List getHeroesList() throws SQLException;
}
