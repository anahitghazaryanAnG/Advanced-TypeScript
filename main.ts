// 1. Create an enum that would fit as argument for the given function:

enum Sounds {
  "Woof!",
  "Meow!",
  "Chirp!",
  "Blub!",
}

function makeAnimalSound(type: Sounds) {
  switch (type) {
    case 0:
      console.log("Woof!");
      break;
    case 1:
      console.log("Meow!");
      break;
    case 2:
      console.log("Chirp!");
      break;
    case 3:
      console.log("Blub!");
      break;
    default:
      console.log("Unknown animal type");
      break;
  }
}

makeAnimalSound(Sounds["Woof!"]);

// 2. Add a type that would cover the structure of the given object:

enum AnimalType {
  Cat = "Cat",
  Dog = "Dog",
  Bird = "Bird",
}

type myPeSounds = {
  name: string;
  age: number;
  type: AnimalType;
};

function getPetDescription(pet: myPeSounds) {
  const animal = AnimalType[pet.type];
  return `${pet.name} is a ${animal.toLowerCase()} that is ${
    pet.age
  } years old.`;
}

const myPet: myPeSounds = {
  name: "Fluffy",
  age: 5,
  type: AnimalType.Cat,
};

console.log(getPetDescription(myPet));

// 3. Add an interface that would cover the structure of the given object(reuse the type from the previous task):

interface IPet {
  name: string;
  age: number;
  pets: myPeSounds[];
}

function getPetOwnerDescription(owner: IPet) {
  const pets = owner.pets.map((pet) => {
    const animal = AnimalType[pet.type];
    return `${pet.name} the ${animal.toLowerCase()}`;
  });
  return `${owner.name} is ${owner.age} years old and has ${
    pets.length
  } pets: ${pets.join(", ")}.`;
}

const myPetOwner: IPet = {
  name: "John Doe",
  age: 30,
  pets: [
    {
      name: "Fluffy",
      age: 5,
      type: AnimalType.Cat,
    },
    {
      name: "Spot",
      age: 3,
      type: AnimalType.Dog,
    },
  ],
};

console.log(getPetOwnerDescription(myPetOwner));

// 4. Create a generic function that would make the following code compile:
const myPets: myPeSounds[] = [
  { name: "Max", age: 3, type: AnimalType.Dog },
  { name: "Fluffy", age: 1, type: AnimalType.Cat },
  { name: "Tweety", age: 2, type: AnimalType.Bird },
];

const mapPetNames = <T extends { name: string }>(pets: T[]): string[] => {
  return pets.map((pet) => pet.name);
};

const petNames = mapPetNames(myPets);
console.log(petNames); // ['Max', 'Fluffy', 'Tweety']
/* ******************************************************************************************************************************** */
function eprint<T>(arg: T): void {
  console.log(arg);
}

eprint("hello");
eprint(42);
eprint(true);
/* ******************************************************************************************************************************** */
function firstElement<T>(arr: T[]): T {
  return arr[0];
}

const numbers = [1, 2, 3, 4, 5];
const firstNumber = firstElement(numbers); // firstNumber is of type number

const strings = ["apple", "banana", "orange"];
const firstString = firstElement(strings); // firstString is of type string
/* ******************************************************************************************************************************** */
type Pair<T, U> = {
  first: T;
  second: U;
};

let pair1: Pair<string, number> = { first: "one", second: 1 };
let pair2: Pair<() => void, any[]> = { first: () => {}, second: [] };
let pair3: Pair<boolean, { x: number }> = { first: true, second: { x: 1 } };

// 5. Create a decorator '@log' that would print given message:

function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  if (originalMethod) {
    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${propertyKey} with arguments:`, args);
      const result = originalMethod.apply(this, args);
      console.log(`Result:`, result);
      return result;
    };
  }

  return descriptor;
}

class MyClass {
  @log
  myMethod(arg1: number, arg2: number) {
    return arg1 + arg2;
  }
}

const myObj = new MyClass();
myObj.myMethod(2, 3);

// Result:
// Calling myMethod with arguments: [ 2, 3 ]
// Result: 5

// 6. Create a mixin that will add the ability to play, pause, and stop a video, as well as to show its duration and current playback time.
/*
  -Create a TypeScript mixin named Playable that will add the functionality to a video class:
    -duration
    -currentTime
    -play()
    -pause()
    -stop()
    -getDuration()
    -getCurrentTime()
  -Create instances of each video class and test their Playable functionality by calling the methods and displaying their properties.
  */

type Constructor<T = { title: string; url: string }> = new (
  ...args: any[]
) => T;

function Playable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    duration: number = 0;
    currentTime: number = 0;

    play() {
      console.log(`${this.title} is now playing.`);
    }

    pause() {
      console.log(`${this.title} is paused.`);
    }

    stop() {
      if (this.currentTime > 0) {
        this.currentTime = 0;
        console.log(`${this.title} is stopped.`);
      }
    }

    getDuration(): number {
      return this.duration;
    }

    getCurrentTime(): number {
      return this.currentTime;
    }
  };
}

class RegularVideo {
  title: string;
  url: string;
  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}

class PremiumVideo {
  title: string;
  url: string;
  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}

class LiveVideo {
  title: string;
  url: string;
  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}

const PlayableRegularVideo = Playable(RegularVideo);
const PlayablePremiumVideo = Playable(PremiumVideo);
const PlayableLiveVideo = Playable(LiveVideo);

const regularVideo = new PlayableRegularVideo(
  "Regular Video",
  "http://example.com/regular"
);
regularVideo.duration = 300;

const premiumVideo = new PlayablePremiumVideo(
  "Premium Video",
  "http://example.com/premium"
);
premiumVideo.duration = 600;

const liveVideo = new PlayableLiveVideo(
  "Live Video",
  "http://example.com/live"
);
liveVideo.duration = 3600;

regularVideo.play();
console.log(`Current time: ${regularVideo.getCurrentTime()}s`);
regularVideo.pause();
regularVideo.stop();
console.log(`Current time after stop: ${regularVideo.getCurrentTime()}s`);

premiumVideo.play();
console.log(`Current time: ${premiumVideo.getCurrentTime()}s`);
premiumVideo.pause();
premiumVideo.stop();
console.log(`Current time after stop: ${premiumVideo.getCurrentTime()}s`);

liveVideo.play();
console.log(`Current time: ${liveVideo.getCurrentTime()}s`);
liveVideo.pause();
liveVideo.stop();
console.log(`Current time after stop: ${liveVideo.getCurrentTime()}s`);

// 7. Apply typescript utility types to the given type:
/*
    -Create a new type from the given one
        -where all the properties are optional
        -where all the properties are required
        -where all the properties are readonly
        -with only properties specified: name, age, isStudent, hobbies
        -with the specified properties omited: job, phoneNumbers, birthday
        -union type where values are given type's keys
    -
  */
type MyType = {
  name: string;
  age: number;
  isStudent: boolean;
  hobbies: string[];
  address: {
    street: string;
    city: string;
    country: string;
  };
  email?: string;
  job?: {
    title: string;
    company: string;
    salary: number;
  };
  phoneNumbers: Map<string, string>;
  birthday: Date;
};

type MyTypeOptional = Partial<MyType>;
type MyTypeRequired = Required<MyType>;
type MyTypeReadonly = Readonly<MyType>;
type MyTypePick = Pick<MyType, "name" | "age" | "isStudent" | "hobbies">;
type MyTypeOmit = Omit<MyType, "job" | "phoneNumbers" | "birthday">;
type MyTypeUnionFromKeys = keyof MyType;
