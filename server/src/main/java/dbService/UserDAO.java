package dbService;

import dbService.entity.SuperheroesEntity;

import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public interface UserDAO {

    SuperheroesEntity getById(short id) throws SQLException;

    SuperheroesEntity getByName(String name) throws SQLException;

    void addNewHero(SuperheroesEntity hero) throws SQLException;

    void deleteHero(SuperheroesEntity hero) throws SQLException;

    void changeHero(SuperheroesEntity hero) throws SQLException;

    List getTable() throws SQLException;
}
