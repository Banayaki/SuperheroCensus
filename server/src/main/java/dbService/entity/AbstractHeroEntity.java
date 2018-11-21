package dbService.entity;

public abstract class AbstractHeroEntity {

    public abstract short getHeroId();

    public abstract void setHeroId(short heroId);

    public abstract String getHeroName();

    public abstract void setHeroName(String heroName);

    public abstract String getUniverse();

    public abstract void setUniverse(String universe);

    public abstract byte getPower();

    public abstract void setPower(byte power);

    public abstract String getDescription();

    public abstract void setDescription(String description);

    public abstract String getIsAlive();

    public abstract void setIsAlive(String isAlive);

    public abstract String getImagePath();

    public abstract void setImagePath(String imagePath);

    public abstract String getPhone();

    public abstract void setPhone(String phone);
}
