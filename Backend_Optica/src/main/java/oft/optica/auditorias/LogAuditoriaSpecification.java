package oft.optica.auditorias;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class LogAuditoriaSpecification {

    public static Specification<LogAuditoriaEntity> conFiltros(
            String tabla, Integer registro, Integer idUsuario,
            String accion, Byte resultado, LocalDateTime desde, LocalDateTime hasta) {

        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (tabla != null) predicates = cb.and(predicates, cb.equal(root.get("tablaAfectada"), tabla));
            if (registro != null) predicates = cb.and(predicates, cb.equal(root.get("registro"), registro));
            if (idUsuario != null) predicates = cb.and(predicates, cb.equal(root.get("usuario").get("id"), idUsuario));
            if (accion != null) predicates = cb.and(predicates, cb.equal(root.get("accion"), accion));
            if (resultado != null) predicates = cb.and(predicates, cb.equal(root.get("resultado"), resultado));
            if (desde != null) predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("fechaEvento"), desde));
            if (hasta != null) predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("fechaEvento"), hasta));

            return predicates;
        };
    }
}
