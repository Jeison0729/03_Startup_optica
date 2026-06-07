-- ==========================================================
-- MODULO: MEDICIONES TECNICAS
-- CONSULTAS DE VERIFICACION CORREGIDAS
-- ==========================================================

-- 1. Vista general con todos los campos del formulario
-- ---------------------------------------------------------
SELECT DISTINCT
    p.nombre_completo           AS paciente,
    c.fecha_consulta,
    c.motivo_consulta,
    c.diagnostico,

    -- Rx en Uso
    m.rx_uso_od_esfera,
    m.rx_uso_od_cilindro,
    m.rx_uso_od_eje,
    m.rx_uso_od_av_vl,
    m.rx_uso_oi_esfera,
    m.rx_uso_oi_cilindro,
    m.rx_uso_oi_eje,
    m.rx_uso_oi_av_vl,

    -- VP
    m.vp_od,
    m.vp_oi,
    m.lente_uso,

    -- K/M
    m.km_od,
    m.km_od_observaciones,
    m.km_oi,
    m.km_oi_observaciones,

    -- Rx intermedia
    m.rx_od,
    m.rx_od_observaciones,
    m.rx_oi,
    m.rx_oi_observaciones,

    -- Modalidad y Titmus
    m.modalidad_ppc,
    m.modalidad_lejos,
    m.modalidad_cerca,
    m.test_titmus,

    -- Rx Final
    m.od_esfera,
    m.od_cilindro,
    m.od_eje,
    m.od_av_vl,
    m.oi_esfera,
    m.oi_cilindro,
    m.oi_eje,
    m.oi_av_vl,
    m.adicion,
    m.distancia_pupilar,
    tl.codigo                   AS tipo_lente_codigo,
    tl.nombre                   AS tipo_lente,
    mat.codigo                  AS material_codigo,
    mat.nombre                  AS material,
    m.observaciones_rx,

    a.nombre                    AS acompanante,
    cp.codigo                   AS parentesco_codigo,
    cp.nombre                   AS parentesco

FROM consultas c
JOIN pacientes p                    ON c.id_paciente = p.id
LEFT JOIN mediciones_optometricas m ON c.id = m.id_consulta
LEFT JOIN cat_tipos_lente tl        ON m.id_tipo_lente = tl.id
LEFT JOIN cat_materiales mat        ON m.id_material = mat.id
LEFT JOIN acompanantes a            ON c.id = a.id_consulta
LEFT JOIN cat_parentescos cp        ON a.id_parentesco = cp.id
ORDER BY c.fecha_consulta DESC;
-- ---------------------------------------------------------

-- 2. Historia clinica completa de Juan Perez (documento 123456789)
-- ---------------------------------------------------------
SELECT DISTINCT
    p.id                        AS paciente_id,
    p.nombre_completo           AS paciente,
    p.numero_documento,
    td.codigo                   AS tipo_documento_codigo,
    td.nombre                   AS tipo_documento,
    p.fecha_nacimiento,
    p.sexo,
    p.ocupacion,
    p.telefono,
    eps.codigo                  AS eps_codigo,
    eps.nombre                  AS eps,

    c.id                        AS consulta_id,
    c.fecha_consulta,
    c.motivo_consulta,
    c.ultimo_control,
    c.ant_personales,
    c.ant_familiares,
    c.examen_externo,
    c.tonometria_od,
    c.tonometria_oi,
    c.test_color,
    c.fondo_ojo,
    c.diagnostico,
    c.conducta,
    c.control_sugerido,
    c.remision,
    ec.codigo                   AS estado_consulta_codigo,
    ec.nombre                   AS estado_consulta,
    u.usuario_nombre            AS optometra,

    -- Rx en Uso
    m.rx_uso_od_esfera,
    m.rx_uso_od_cilindro,
    m.rx_uso_od_eje,
    m.rx_uso_od_av_vl,
    m.rx_uso_oi_esfera,
    m.rx_uso_oi_cilindro,
    m.rx_uso_oi_eje,
    m.rx_uso_oi_av_vl,

    -- VP y lente en uso
    m.vp_od,
    m.vp_oi,
    m.lente_uso,

    -- K/M
    m.km_od,
    m.km_od_observaciones,
    m.km_oi,
    m.km_oi_observaciones,

    -- Rx intermedia
    m.rx_od,
    m.rx_od_observaciones,
    m.rx_oi,
    m.rx_oi_observaciones,

    -- Modalidad y Titmus
    m.modalidad_ppc,
    m.modalidad_lejos,
    m.modalidad_cerca,
    m.test_titmus,

    -- Rx Final
    m.od_esfera,
    m.od_cilindro,
    m.od_eje,
    m.od_av_vl,
    m.oi_esfera,
    m.oi_cilindro,
    m.oi_eje,
    m.oi_av_vl,
    m.adicion,
    m.distancia_pupilar,
    tl.codigo                   AS tipo_lente_codigo,
    tl.nombre                   AS tipo_lente,
    mat.codigo                  AS material_codigo,
    mat.nombre                  AS material,
    m.observaciones_rx,

    a.nombre                    AS acompanante,
    cp.codigo                   AS parentesco_acomp_codigo,
    cp.nombre                   AS parentesco_acomp,
    a.telefono                  AS telefono_acomp

FROM pacientes p
JOIN cat_tipos_documento td         ON p.id_tipo_documento = td.id
LEFT JOIN cat_eps eps               ON p.id_eps = eps.id
JOIN consultas c                    ON p.id = c.id_paciente
JOIN usuarios u                     ON c.id_optometra = u.id
JOIN cat_estados_consulta ec        ON c.id_estado_consulta = ec.id
LEFT JOIN mediciones_optometricas m ON c.id = m.id_consulta
LEFT JOIN cat_tipos_lente tl        ON m.id_tipo_lente = tl.id
LEFT JOIN cat_materiales mat        ON m.id_material = mat.id
LEFT JOIN acompanantes a            ON c.id = a.id_consulta
LEFT JOIN cat_parentescos cp        ON a.id_parentesco = cp.id

WHERE p.numero_documento = '123456789'
ORDER BY c.fecha_consulta DESC;
-- ---------------------------------------------------------

-- 3. Verificar integridad: cada consulta debe tener exactamente una medicion
-- ---------------------------------------------------------
SELECT
    c.id                        AS consulta_id,
    p.nombre_completo           AS paciente,
    c.fecha_consulta,
    c.diagnostico,
    CASE 
        WHEN COUNT(m.id) = 0 THEN 'SIN MEDICION'
        WHEN COUNT(m.id) = 1 THEN 'OK'
        ELSE 'MULTIPLES MEDICIONES'
    END                         AS estado_integridad,
    COUNT(m.id)                 AS total_mediciones
FROM consultas c
JOIN pacientes p                    ON c.id_paciente = p.id
LEFT JOIN mediciones_optometricas m ON c.id = m.id_consulta
GROUP BY c.id, p.nombre_completo, c.fecha_consulta, c.diagnostico
ORDER BY c.id;
-- ---------------------------------------------------------

-- 4. Resumen general: total de consultas por paciente
-- ---------------------------------------------------------
SELECT
    p.id                        AS paciente_id,
    p.nombre_completo           AS paciente,
    p.numero_documento,
    td.codigo                   AS tipo_documento,
    COUNT(c.id)                 AS total_consultas,
    MIN(c.fecha_consulta)       AS primera_consulta,
    MAX(c.fecha_consulta)       AS ultima_consulta,
    COUNT(DISTINCT EXTRACT(YEAR FROM c.fecha_consulta)) AS anos_con_consultas
FROM pacientes p
LEFT JOIN cat_tipos_documento td   ON p.id_tipo_documento = td.id
LEFT JOIN consultas c              ON p.id = c.id_paciente
GROUP BY p.id, p.nombre_completo, p.numero_documento, td.codigo
ORDER BY total_consultas DESC;
-- ==========================================================

-- 5. CONSULTA ADICIONAL: Detalle de mediciones por tipo de lente y material
-- ---------------------------------------------------------
SELECT 
    tl.codigo                   AS tipo_lente_codigo,
    tl.nombre                   AS tipo_lente,
    mat.codigo                  AS material_codigo,
    mat.nombre                  AS material,
    COUNT(DISTINCT c.id)        AS total_consultas,
    COUNT(DISTINCT p.id)        AS total_pacientes
FROM consultas c
JOIN pacientes p                    ON c.id_paciente = p.id
JOIN mediciones_optometricas m      ON c.id = m.id_consulta
LEFT JOIN cat_tipos_lente tl        ON m.id_tipo_lente = tl.id
LEFT JOIN cat_materiales mat        ON m.id_material = mat.id
WHERE m.id_tipo_lente IS NOT NULL
GROUP BY tl.codigo, tl.nombre, mat.codigo, mat.nombre
ORDER BY total_consultas DESC;
-- ==========================================================

-- 6. CONSULTA ADICIONAL: Evolucion de un paciente especifico
-- ---------------------------------------------------------
SELECT 
    c.fecha_consulta,
    c.diagnostico,
    m.od_esfera                  AS OD_esfera_actual,
    m.od_cilindro                AS OD_cilindro_actual,
    m.oi_esfera                  AS OI_esfera_actual,
    m.oi_cilindro                AS OI_cilindro_actual,
    LAG(m.od_esfera) OVER (ORDER BY c.fecha_consulta) AS OD_esfera_anterior,
    LAG(m.od_cilindro) OVER (ORDER BY c.fecha_consulta) AS OD_cilindro_anterior,
    CASE 
        WHEN m.od_esfera > LAG(m.od_esfera) OVER (ORDER BY c.fecha_consulta) THEN 'Aumento'
        WHEN m.od_esfera < LAG(m.od_esfera) OVER (ORDER BY c.fecha_consulta) THEN 'Disminucion'
        WHEN m.od_esfera = LAG(m.od_esfera) OVER (ORDER BY c.fecha_consulta) THEN 'Estable'
        ELSE 'Sin dato previo'
    END                         AS tendencia_OD
FROM consultas c
JOIN pacientes p                    ON c.id_paciente = p.id
LEFT JOIN mediciones_optometricas m ON c.id = m.id_consulta
WHERE p.numero_documento = '123456789'
  AND m.id IS NOT NULL
ORDER BY c.fecha_consulta;
-- ==========================================================