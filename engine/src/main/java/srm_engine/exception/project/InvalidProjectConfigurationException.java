package srm_engine.exception.project;

/**
 * Exceção lançada quando as configurações físicas ou dimensionais do projeto são logicamente inválidas.
 */
public class InvalidProjectConfigurationException extends RuntimeException {

    public InvalidProjectConfigurationException(String message) {
        super(message);
    }
}