abstract class ITower {
    x: number;
    y: number;
    radius: number;
    name: string;
    constructor(name: string) {
        this.name = name;
    }

}

class TwGroundOne extends  ITower {
    constructor() {
        this.radius = 5;

        super("Grnd2");
    }
}

class TwGroundTwo extends ITower {
    constructor() {
        super("Grnd1");
    }
}

class TwAir extends ITower {
    constructor() {
        super("Air");
    }
}

class TwMixed extends ITower {
    constructor() {
        super("Mixed");
    }
}