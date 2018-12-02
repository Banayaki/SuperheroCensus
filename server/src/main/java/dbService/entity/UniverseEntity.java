package dbService.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "UNIVERSES")
public class UniverseEntity {
    private String universe_name;

    public UniverseEntity() {

    }

    public UniverseEntity(String universe_name) {
        this.universe_name = universe_name;
    }

    @Id
    public String getUniverse_name() {
        return universe_name;
    }

    public void setUniverse_name(String universe_name) {
        this.universe_name = universe_name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UniverseEntity that = (UniverseEntity) o;
        return Objects.equals(universe_name, that.universe_name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(universe_name);
    }

    @Override
    public String toString() {
        return universe_name;
    }
}
