---
title: Artificial chemistry
publish_date: 2024-11-17
public: true
---

Since I was in middle school I've been fascinated by artificial chemistry. I remember creating simulations in ActionScript of little billard balls bouncing around and reacting. I spent my time battling little [darwinbots](https://github.com/darwinbots), and designing rulesets and little "creatures" in [golly](https://golly.sourceforge.io/). I even had a little [Core Wars](https://en.wikipedia.org/wiki/Core_War) phase. [Tim Hutton](https://github.com/timhutton) was my secret hero, and his java applet (rewritten [here](https://github.com/timhutton/livingphysics)) and his many wonderful papers ([1](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&citation_for_view=fLBzOiIAAAAJ:u-x6o8ySG0sC), [2](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&cstart=20&pagesize=80&citation_for_view=fLBzOiIAAAAJ:WF5omc3nYNoC), [3](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&cstart=20&pagesize=80&citation_for_view=fLBzOiIAAAAJ:Se3iqnhoufwC), [4](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&citation_for_view=fLBzOiIAAAAJ:YsMSGLbcyi4C), [5](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&cstart=20&pagesize=80&citation_for_view=fLBzOiIAAAAJ:eQOLeE2rZwMC), [6](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&cstart=20&pagesize=80&citation_for_view=fLBzOiIAAAAJ:MXK_kJrjxJIC), [7](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&citation_for_view=fLBzOiIAAAAJ:IjCSPb-OGe4C), [8](https://scholar.google.co.uk/citations?view_op=view_citation&hl=en&user=fLBzOiIAAAAJ&citation_for_view=fLBzOiIAAAAJ:hqOjcs7Dif8C)) opened my eyes to what might be possible to create. I'd sit through college classes on UML dreaming of different representations of particles, rules, and the kind of "life" they'd enable.

But there's something under the surface; an implicit goal we're all trying to approach. Elegance. It's easy to create an organism by programming it. By specifying all the rules, you can create dna, membranes, photosynthesis, neurons and muscles. If this then that; cause and effect. But that's not how the universe works. The fundamental laws of the universe are [equations](https://en.wikipedia.org/wiki/Conservation_law#Exact_laws). They deal with two things being equal. There is no "causality" involved. Simply symmetry.

The challenge is to build the most complex, adapted, life-like organism using the most minimal, elegant, and abstract set of rules. Here is an attempt:

### Types
```ts
class Particle {
  // Immutable
  atomicNumber: number; // A non-negative integer

  // Mutable
  position: Vector2d;
  momentum: Vector2d;
  bonds: Particle[];
  quarks: Quark[];

  bondCapacity() {
    return this.atomicNumber;
  }

  mass() {
    return (this.atomicNumber + 1) * this.atomicNumber / 2;
  }

  type() {
    return this.mass() + this.bonds.length;
  }
}

class Quark {
  // Mutable
  typeSequence: number[]; // A sequence of non-negative integers
}
```

### Symmetries
- Conservation of momentum (the sum of all atoms' `momentum`)
- Conservation of kinetic energy (the sum of all atoms' `0.5 * momentum.lengthSq() / mass` plus stored bond energy)
- Conservation of mass. This implies conservation of particles with nonzero mass.
- Conservation of quarks (quarks cannot be created or destroyed).

Note that in a simulation, there can still be boundary conditions that allow growth, such as sunlight (photons with empty or random quarks).

### Interactions
The number of bonds an atom can have is limited by its atomic number. An atom's type uniquely identifies its atomic number and bond count.
```
type=0 -> N=0, mass=0, bonds=0 (photon)
type=1 -> N=1, mass=1, bonds=0
type=2 -> N=1, mass=1, bonds=1
type=3 -> N=2, mass=3, bonds=0
type=4 -> N=2, mass=3, bonds=1
type=5 -> N=2, mass=3, bonds=2
type=6 -> N=3, mass=6, bonds=0
type=...
```

Quarks are a sequence of non-negative integers. They are always attached to a particle. They repeatedly attempt to pop the next type T and move itself (the quark) onto a particle with type T. They can do this via 4 methods:
- Move via an existing bond
- Move via a collision with another particle
- Move via creating a bond with a colliding particle with type T-1, bond count less than capacity, and a collision involving enough kinetic energy. This will result in the colliding particle changing from type T-1 to T.
- Move via destroying a bond with a bonded particle of type T+1. This releases kinetic energy and will result in the particle changing from type T+1 to T.

After moving, the type T is popped and the sequence continues with the next type.

An extension might be to give significance to negative numbers in the quark sequence.
- Positive numbers cannot destroy and negative numbers cannot create?
- Negative numbers interact with other quarks, possibly cancelling their actions?

### Photons
Photons emerge from the concept of a massless particle (N=0). Because they are massless, their existence isn't bounded by the conservation of mass law, and can be thought of springing into existence everywhere, all the time. Since their mass is zero, their velocity is infinite and they pass through other matter.

Photons are created by a type=0 in a quark and are ejected towards the lowest potential at an infinite velocity.

Photons have no effect and are undetectable, unless they carry a quark. A photon with a quark works in the same way as any other particle. If it matches the type of a particle that the photon is passing through, the quark is "dropped off".

### Bond dynamics
Bonds repel each other. I'm not sure how to do this and conserve momentum but the energy probably needs to come from the instant the bond is created.

The base kinetic energy of a bond is unspecified but `A.mass + B.mass` seems like a good option.

### Empty quarks
Since quarks are conserved, at the end of their sequence they're ejected as a photon. Instead of matching on particle type, an empty quark will match any other quark and duplicate it. It's dropped off on that particle.

### Physical model
What is the behavior of a single atom, specifically upon collision with another atom? There's a number of options:
- A billard ball model is simple and predictable, albeit likely slower to simulate than a grid-based embedding.
- An atom's x,y coordinate is splatted into a cell on a rectangular grid.
- An atom's x,y coordinate is splatted into a cell on a hexagonal grid.
- [Hexagonal lattice gas](https://en.wikipedia.org/wiki/Lattice_gas_automaton#Hexagonal_grids): an atom's position is entirely defined by the cell it's in.
- [Rectangular lattice gas](https://en.wikipedia.org/wiki/Lattice_gas_automaton#Early_attempts_with_a_square_lattice): this doesn't really conserve momentum well
