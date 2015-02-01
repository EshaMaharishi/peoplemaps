# PeopleMaps

### The Elevator Pitch

In its essence, the PeopleMaps project is an alternative to traditional route suggestion platforms (such as **Google Maps** and **Apple Maps**) which relies solely on users' behavior to suggest routes between locations.

It differs from **Waze** and similar feature-based crowdsourced algorithms in that it completely rejects the idea of quantifying *why* a particular user may have chosen a route (traffic congestion, accident on the road, etc). Instead, it uses the facts that:

1) the majority of paths taken in a region are taken by locals

2) locals have an intimate, holistic, and immediate understanding of their environment 

to advocate for determining best paths based on user behavior.

### A Little Deeper into the Theory

**Humans can digest a vast number of nuanced factors** that are difficult to measure, quantify, or weight in aggregate (for example, the safety of a particular neighborhood, the status of an ongoing construction site, the presence of children on a particular street, a route typically congested at peak hours). Though many of these *are* measurable by a centralized institution, determining a holistic best path from them is a **difficult problem**. Also, it's sometimes wasteful to quantify every possible factor for every environment--often only 2 or 3 factors are relevant in any particular case.

Therefore, **PeopleMaps treats users as distributed, decentralized network of smart sensors** who report their "opinion" of various paths to the central system in the form of **"votes"**: each time a user takes a path P between point A and B, he or she is casting a vote for that path over all other possible paths. Then when giving path suggestions, PeopleMaps returns the highest-voted path between the requested endpoints.

By further weighting the most recent votes most highly, PeopleMaps aims to achieve a **real-time** best-route suggestion scheme at minimal infrastructural cost. Where other route suggestion schemes must wait for data (from sensors, reporters, etc.) to be collected before updating their suggestions, PeopleMaps takes the most up-to-date information directly into account.

## The Motivation (a high school senior's frustrations with GPS)

When I lived outside D.C. as a high schooler four years ago, I would often accompany my dad on various errands around the greater-D.C. region. We relied on a GPS for directions, often holding an iPhone and typical car GPS next to each other and trying to reconcile our own knowledge with the GPS suggestions to find the best--aka smoothest, fastest, most pleasant--routes. To our frustration and sometimes humor, the GPS suggestions would lack basic knowledge that any local in the area had, largely because the **GPS offered us only binary options**: toll or no toll? Use or avoid highways?

The reality was that a relatively small sequence of binary options generally did not yield the best holistic path. The paths we knew from experience were a nuanced, weighted combination of factors. If someone asked us for the best paths personally, we would have different answers.

And so the idea for PeopleMaps was born: why *shouldn't* people like us be consulted for best path suggestions? We lived and drove around the area for years. We knew it better, more intuitively, than any centralized system. We were the most powerful sensors of our environment.

Four years later, PeopleMaps is readily being developed, with a functioning iOS application prototype already in existence and hosted on Amazon Cloud.

## Application Architecture and Flow


## Path Clustering Algorithm


## The MapReduce Algorithm


## Cloud Hosting


## Wider Applications and Eventual Direction
