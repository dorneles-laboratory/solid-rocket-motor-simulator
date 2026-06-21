package srm_engine.exception.project;

/**
 * Exceção lançada quando um projeto de motor não é encontrado no sistema.
 */
public class ProjectNotFoundException extends Exception {

    public ProjectNotFoundException(String message) {
        super(message);
    }
}