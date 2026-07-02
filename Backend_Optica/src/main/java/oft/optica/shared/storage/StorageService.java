package oft.optica.shared.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    public String subirArchivo(MultipartFile archivo, String key) {
        // TODO: conectar Cloudflare R2 en producción
        return key;
    }

    public String generarUrlFirmada(String key) {
        // TODO: conectar Cloudflare R2 en producción
        return "https://placeholder.storage/" + key;
    }

    public void eliminarArchivo(String key) {
        // TODO: conectar Cloudflare R2 en producción
    }
}
