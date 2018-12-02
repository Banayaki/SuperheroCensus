package dbService.entity;

public abstract class AbstractHeroEntity {

    public abstract short getHeroId();

    public abstract void setHeroId(short heroId);

    public abstract String getHeroName();

    public abstract void setHeroName(String heroName);

    public abstract UniverseEntity getUniverse();

    public abstract void setUniverse(UniverseEntity universe);

    public abstract byte getPower();

    public abstract void setPower(byte power);

    public abstract String getDescription();

    public abstract void setDescription(String description);

    public abstract BooleanStateEntity getIsAlive();

    public abstract void setIsAlive(BooleanStateEntity isAlive);

    public abstract String getImagePath();

    public abstract void setImagePath(String imagePath);

    public abstract String getPhone();

    public abstract void setPhone(String phone);
}
