package dbService.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "BOOL_STATES")
public class BooleanStateEntity {
    private String bool_state;

    public BooleanStateEntity() {

    }

    public BooleanStateEntity(String bool_state) {
        this.bool_state = bool_state;
    }

    @Id
    public String getBool_state() {
        return bool_state;
    }

    public void setBool_state(String bool_state) {
        this.bool_state = bool_state;
    }

    @Override
    public String toString() {
        return bool_state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BooleanStateEntity that = (BooleanStateEntity) o;
        return Objects.equals(bool_state, that.bool_state);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bool_state);
    }
}
