# Package Boundaries

Enforce package boundaries to maintain modularity:

- Domain layer may import from other domain layers: `src/packages/<package-name>/domain/**/*`
- Usecases layer may import from other usecases layers: `src/packages/<package-name>/usecases/**/*`
- Repository layer may import from other repository layers: `src/packages/<package-name>/repository/**/*`
- Presentation layer may import from other presentation layers: `src/packages/<package-name>/presentation/**/*`
