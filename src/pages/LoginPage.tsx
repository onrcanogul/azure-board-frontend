import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  PrimaryButton,
  Stack,
  Text,
  mergeStyleSets,
  Checkbox,
  Link,
  Icon,
  MessageBar,
  MessageBarType,
  Toggle,
} from "@fluentui/react";
import type { ITextFieldStyles, IToggleStyles } from "@fluentui/react";
import styled from "@emotion/styled";

const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #20211e;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #232422;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px;
  margin: 0;
  color: ${(props) => (props.isActive ? "#4fa3ff" : "#bdbdbd")};
  font-size: 16px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.isActive ? "#4fa3ff" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    color: ${(props) => (props.isActive ? "#4fa3ff" : "#ffffff")};
  }

  &:focus {
    outline: none;
  }
`;

const styles = mergeStyleSets({
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 24,
    color: "#fff",
  },
  field: {
    marginBottom: 16,
  },
  forgotPassword: {
    marginTop: 10,
    marginBottom: 16,
    textAlign: "right",
  },
  rememberMeContainer: {
    marginBottom: 24,
  },
  errorMessage: {
    color: "#f25022",
    marginBottom: 16,
    fontSize: 14,
  },
  successMessage: {
    marginBottom: 16,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4fa3ff",
  },
});

// TextField stilleri için fonksiyon
const getTextFieldStyles = (): Partial<ITextFieldStyles> => {
  return {
    fieldGroup: {
      borderColor: "#464644",
      backgroundColor: "#2d2d2b",
    },
    field: { color: "#fff" },
    subComponentStyles: {
      label: {
        root: { color: "#bdbdbd" },
      },
    },
  };
};

// Şifre gereksinimleri kontrolü
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Şifre en az 8 karakter olmalıdır");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Şifre en az bir büyük harf içermelidir");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Şifre en az bir küçük harf içermelidir");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Şifre en az bir rakam içermelidir");
  }

  return errors;
};

const AuthPage = () => {
  // Ortak state'ler
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login state'leri
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register state'leri
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState<string[]>([]);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Formları sıfırla
    setLoginError("");
    setRegisterErrors([]);
    setRegisterSuccess(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginUsername || !loginPassword) {
      setLoginError("Lütfen kullanıcı adı ve şifrenizi girin.");
      return;
    }

    setIsLoading(true);

    try {
      // Simule edilmiş login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Başarılı login sonrası ana sayfaya yönlendir
      navigate("/boards");
    } catch (err) {
      setLoginError("Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: string[] = [];

    if (!fullName) newErrors.push("Ad Soyad alanı zorunludur");
    if (!email) newErrors.push("E-posta alanı zorunludur");
    if (!username) newErrors.push("Kullanıcı adı alanı zorunludur");
    if (!password) newErrors.push("Şifre alanı zorunludur");

    // E-posta doğrulama
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.push("Geçerli bir e-posta adresi giriniz");
    }

    // Şifre doğrulama
    if (password) {
      const passwordErrors = validatePassword(password);
      newErrors.push(...passwordErrors);
    }

    // Şifre eşleşme kontrolü
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push("Şifreler eşleşmiyor");
    }

    setRegisterErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simule edilmiş kayıt işlemi
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setRegisterSuccess(true);

      // Başarılı kayıt sonrası 2 saniye bekleyip login tab'ine geç
      setTimeout(() => {
        setIsLogin(true);
        // Kayıt formunu temizle
        setFullName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setRegisterErrors([]);
        setRegisterSuccess(false);
      }, 2000);
    } catch (err) {
      setRegisterErrors([
        "Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <FormContainer>
        <div className={styles.logoContainer}>
          <Icon
            iconName="AzureLogo"
            style={{ color: "#4fa3ff", fontSize: 28 }}
          />
          <span className={styles.logoText}>Onur Board</span>
        </div>

        <TabContainer>
          <TabButton
            isActive={isLogin}
            onClick={() => !isLogin && toggleForm()}
          >
            Giriş Yap
          </TabButton>
          <TabButton
            isActive={!isLogin}
            onClick={() => isLogin && toggleForm()}
          >
            Kayıt Ol
          </TabButton>
        </TabContainer>

        {isLogin ? (
          // LOGIN FORMU
          <>
            <Text className={styles.title}>Hesabınıza giriş yapın</Text>

            {loginError && (
              <Text className={styles.errorMessage}>{loginError}</Text>
            )}

            <form onSubmit={handleLogin}>
              <Stack tokens={{ childrenGap: 16 }}>
                <TextField
                  label="Kullanıcı Adı"
                  required
                  value={loginUsername}
                  onChange={(_, newValue) => setLoginUsername(newValue || "")}
                  className={styles.field}
                  placeholder="Kullanıcı adınızı girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading}
                />

                <TextField
                  label="Şifre"
                  required
                  type="password"
                  value={loginPassword}
                  onChange={(_, newValue) => setLoginPassword(newValue || "")}
                  className={styles.field}
                  placeholder="Şifrenizi girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading}
                />

                <div className={styles.rememberMeContainer}>
                  <Checkbox
                    label="Beni hatırla"
                    checked={rememberMe}
                    onChange={(_, checked) => setRememberMe(!!checked)}
                    styles={{
                      label: { color: "#bdbdbd" },
                    }}
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.forgotPassword}>
                  <Link styles={{ root: { color: "#4fa3ff" } }}>
                    Şifremi unuttum
                  </Link>
                </div>

                <PrimaryButton
                  type="submit"
                  text="Giriş Yap"
                  disabled={isLoading}
                  styles={{
                    root: {
                      backgroundColor: "#4fa3ff",
                      borderRadius: 4,
                      padding: "10px 0",
                    },
                    rootHovered: {
                      backgroundColor: "#3a8ad4",
                    },
                  }}
                />
              </Stack>
            </form>
          </>
        ) : (
          // REGISTER FORMU
          <>
            <Text className={styles.title}>Yeni Hesap Oluştur</Text>

            {registerSuccess && (
              <MessageBar
                className={styles.successMessage}
                messageBarType={MessageBarType.success}
              >
                Kayıt işleminiz başarıyla tamamlandı! Giriş formuna
                yönlendiriliyorsunuz...
              </MessageBar>
            )}

            {registerErrors.length > 0 && (
              <Stack>
                {registerErrors.map((error, index) => (
                  <Text key={index} className={styles.errorMessage}>
                    • {error}
                  </Text>
                ))}
              </Stack>
            )}

            <form onSubmit={handleRegister}>
              <Stack tokens={{ childrenGap: 16 }}>
                <TextField
                  label="Ad Soyad"
                  required
                  value={fullName}
                  onChange={(_, newValue) => setFullName(newValue || "")}
                  className={styles.field}
                  placeholder="Adınızı ve soyadınızı girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading || registerSuccess}
                />

                <TextField
                  label="E-posta"
                  required
                  type="email"
                  value={email}
                  onChange={(_, newValue) => setEmail(newValue || "")}
                  className={styles.field}
                  placeholder="E-posta adresinizi girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading || registerSuccess}
                />

                <TextField
                  label="Kullanıcı Adı"
                  required
                  value={username}
                  onChange={(_, newValue) => setUsername(newValue || "")}
                  className={styles.field}
                  placeholder="Kullanıcı adınızı girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading || registerSuccess}
                />

                <TextField
                  label="Şifre"
                  required
                  type="password"
                  value={password}
                  onChange={(_, newValue) => setPassword(newValue || "")}
                  className={styles.field}
                  placeholder="Şifrenizi girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading || registerSuccess}
                />

                <TextField
                  label="Şifre (Tekrar)"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(_, newValue) => setConfirmPassword(newValue || "")}
                  className={styles.field}
                  placeholder="Şifrenizi tekrar girin"
                  styles={getTextFieldStyles()}
                  disabled={isLoading || registerSuccess}
                />

                <PrimaryButton
                  type="submit"
                  text="Kayıt Ol"
                  disabled={isLoading || registerSuccess}
                  styles={{
                    root: {
                      backgroundColor: "#4fa3ff",
                      borderRadius: 4,
                      padding: "10px 0",
                    },
                    rootHovered: {
                      backgroundColor: "#3a8ad4",
                    },
                  }}
                />
              </Stack>
            </form>
          </>
        )}
      </FormContainer>
    </LoginContainer>
  );
};

export default AuthPage;
