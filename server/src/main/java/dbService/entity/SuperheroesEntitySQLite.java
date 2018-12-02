package dbService.entity;

import javax.persistence.*;
import java.io.Serializable;

@SuppressWarnings("DefaultAnnotationParam")
@Entity
@Table(name = "SUPERHEROES")
public class SuperheroesEntitySQLite extends AbstractHeroEntity implements Serializable {
    private short heroId;
    private String heroName;
    private UniverseEntity universe;
    private byte power;
    private String description;
    private BooleanStateEntity isAlive;
    private String imagePath;
    private String phone;

    public SuperheroesEntitySQLite() {

    }

    public SuperheroesEntitySQLite(short heroId, String heroName, UniverseEntity universe, byte power, String description,
                                   BooleanStateEntity isAlive, String imagePath, String phone) {
        this.heroId = heroId;
        this.heroName = heroName;
        this.universe = universe;
        this.power = power;
        this.description = description;
        this.isAlive = isAlive;
        this.imagePath = imagePath;
        this.phone = phone;
    }

    @Override
    public short getHeroId() {
        return 0;
    }

    @Override
    public void setHeroId(short heroId) {
        this.heroId = heroId;
    }

    @Id
    @Column(name = "HERO_NAME", nullable = false)
    @Override
    public String getHeroName() {
        return heroName;
    }

    @Override
    public void setHeroName(String heroName) {
        this.heroName = heroName;
    }

    @Basic
    @Column(name = "UNIVERSE", nullable = false)
    @JoinColumn(name = "universe_name", table = "UNIVERSES")
    @Override
    public UniverseEntity getUniverse() {
        return universe;
    }

    @Override
    public void setUniverse(UniverseEntity universe) {
        this.universe = universe;
    }

    @Basic
    @Column(name = "POWER", nullable = false)
    @Override
    public byte getPower() {
        return power;
    }

    @Override
    public void setPower(byte power) {
        this.power = power;
    }

    @Basic
    @Column(name = "DESCRIPTION", nullable = true)
    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "IS_ALIVE", nullable = false)
    @JoinColumn(name = "bool_state", table = "BOOL_STATES")
    @Override
    public BooleanStateEntity getIsAlive() {
        return isAlive;
    }

    @Override
    public void setIsAlive(BooleanStateEntity isAlive) {
        this.isAlive = isAlive;
    }

    @Basic
    @Column(name = "IMAGE_PATH", nullable = true)
    @Override
    public String getImagePath() {
        return imagePath;
    }

    @Override
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    @Basic
    @Column(name = "PHONE", nullable = true)
    @Override
    public String getPhone() {
        return phone;
    }

    @Override
    public void setPhone(String phone) {
        this.phone = phone;
    }

    @SuppressWarnings("RedundantIfStatement")
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SuperheroesEntitySQLite that = (SuperheroesEntitySQLite) o;

        if (heroId != that.heroId) return false;
        if (power != that.power) return false;
        if (heroName != null ? !heroName.equals(that.heroName) : that.heroName != null) return false;
        if (universe != null ? !universe.equals(that.universe) : that.universe != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (isAlive != null ? !isAlive.equals(that.isAlive) : that.isAlive != null) return false;
        if (imagePath != null ? !imagePath.equals(that.imagePath) : that.imagePath != null) return false;
        if (phone != null ? !phone.equals(that.phone) : that.phone != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = (int) heroId;
        result = 31 * result + (heroName != null ? heroName.hashCode() : 0);
        result = 31 * result + (universe != null ? universe.hashCode() : 0);
        result = 31 * result + (int) power;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (isAlive != null ? isAlive.hashCode() : 0);
        result = 31 * result + (imagePath != null ? imagePath.hashCode() : 0);
        result = 31 * result + (phone != null ? phone.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return heroName + '\n' +
                universe + '\n' +
                power + '\n' +
                description + '\n' +
                isAlive + '\n' +
                imagePath + '\n' +
                phone + '\n';
    }
}
