package objects;

public class Math extends Schema{
    private double min;
    private double max;
    private String unit;
    public Math(String name, String desc,double min,double max,String unit) {
        super(name, desc);
        this.min = min;
        this.max = max;
        this.unit = unit;
    }

    public double getMin() {
        return min;
    }

    public void setMin(double min) {
        this.min = min;
    }

    public double getMax() {
        return max;
    }

    public void setMax(double max) {
        this.max = max;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    @Override
    public void prettyPrint(){
        System.out.println("Title: "+this.getName());
        System.out.println("Desc: "+this.getDesc());
        System.out.println("Min: "+this.getMin());
        System.out.println("Max: "+this.getMax());
        System.out.println("Unit: "+this.getUnit());
    }
}
