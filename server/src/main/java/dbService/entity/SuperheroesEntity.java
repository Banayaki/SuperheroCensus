package dbService.entity;

import javax.persistence.*;
import java.io.Serializable;

@SuppressWarnings("DefaultAnnotationParam")
@Entity
@Table(name = "SUPERHEROES", schema = "SUPERHEROCENSUS")
public class SuperheroesEntity implements Serializable {
    private short heroId;
    private String heroName;
    private String universe;
    private byte power;
    private String description;
    private String isAlive;
    private String imagePath;
    private String phone;

    public SuperheroesEntity() {

    }

    public SuperheroesEntity(short heroId, String heroName, String universe, byte power, String description,
                             String isAlive, String imagePath, String phone) {
        this.heroId = heroId;
        this.heroName = heroName;
        this.universe = universe;
        this.power = power;
        this.description = description;
        this.isAlive = isAlive;
        this.imagePath = imagePath;
        this.phone = phone;
    }

    @Id
    @Column(name = "HERO_ID", nullable = false, precision = 0)
    public short getHeroId() {
        return heroId;
    }

    public void setHeroId(short heroId) {
        this.heroId = heroId;
    }

    @Basic
    @Column(name = "HERO_NAME", nullable = false, length = 20)
    public String getHeroName() {
        return heroName;
    }

    public void setHeroName(String heroName) {
        this.heroName = heroName;
    }

    @Basic
    @Column(name = "UNIVERSE", nullable = false, length = 20)
    public String getUniverse() {
        return universe;
    }

    public void setUniverse(String universe) {
        this.universe = universe;
    }

    @Basic
    @Column(name = "POWER", nullable = false, precision = 0)
    public byte getPower() {
        return power;
    }

    public void setPower(byte power) {
        this.power = power;
    }

    @Basic
    @Column(name = "DESCRIPTION", nullable = true, length = 2000)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "IS_ALIVE", nullable = true, length = 1)
    public String getIsAlive() {
        return isAlive;
    }

    public void setIsAlive(String isAlive) {
        this.isAlive = isAlive;
    }

    @Basic
    @Column(name = "IMAGE_PATH", nullable = true, length = 60)
    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    @Basic
    @Column(name = "PHONE", nullable = true, length = 20)
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @SuppressWarnings("RedundantIfStatement")
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SuperheroesEntity that = (SuperheroesEntity) o;

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
