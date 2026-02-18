
import org.springframework.security.crypto.bcrypt.BCrypt;

public class RunBcrypt {
    public static void main(String[] args) {
        String password = "admin1234";
        // Convert to log rounds of 10 which is default for BCryptPasswordEncoder
        String hashed = BCrypt.hashpw(password, BCrypt.gensalt(10));
        System.out.println("HASH:" + hashed);
    }
}
