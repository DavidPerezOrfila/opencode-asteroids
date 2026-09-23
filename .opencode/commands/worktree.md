---
description: Crea un git worktree en .worktrees/<nombre>
---

Crea un git worktree nuevo. Convierte el argumento a kebab-case: minúsculas, sin acentos, espacios y símbolos reemplazados por un guion, sin guiones dobles ni al inicio/fin.

Ejemplo: `Mi Nueva Rama` → `mi-nueva-rama`.

Ejecuta:

```
mkdir -p .worktrees && git worktree add .worktrees/<nombre-kebab>
```

Si no hay argumento, pregunta el nombre antes de ejecutar nada.
