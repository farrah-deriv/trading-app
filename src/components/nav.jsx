import { Show } from "solid-js";
import { useNavigate } from "solid-app-router";
import classNames from "classnames";
import Logo from "../../src/assets/logo2.png";
import styles from "../styles/navbar.module.scss";
import { loginUrl } from "Constants/deriv-urls";
import {
  login_information,
  logout,
  balance_of_all_accounts,
} from "Stores/base-store";
import { setshowAccountSwitcher } from "Stores/ui-store";
import { is_light_theme, setIsLightTheme } from "../stores";
import { isDesktop, isMobile } from "Utils/responsive";

const NavBar = () => {
  const navigate = useNavigate();
  const current_acc_data = () => {
    const account = JSON.parse(login_information?.active_account);
    return balance_of_all_accounts()[account.loginid];
  };

  const AccountHeader = () => {
    return (
      <Show
        when={login_information.is_logged_in && balance_of_all_accounts()}
        fallback={<>Waiting for Accounts</>}
      >
        <div class={styles.account_wrapper}>
          <span>
            {current_acc_data()?.balance} {current_acc_data()?.currency}
          </span>
          <i class={styles.arrow_down} />
        </div>
      </Show>
    );
  };

  return (
    <section class={isDesktop() ? styles.topnav_desktop : styles.topnav_mobile}>
      {isMobile() && (
        <>
          <input id={styles.menu_toggle} type="checkbox" />
          <label class={styles.menu_button_container} for={styles.menu_toggle}>
            <div class={styles.menu_button} />
          </label>
          <a href="/" class={styles.logo}>
            <img src={Logo} class={styles.logo} />
          </a>
        </>
      )}
      <ul class={styles.menu}>
        {isDesktop() && (
          <li>
            <a href="/" class={styles.logo}>
              <img src={Logo} class={styles.logo} />
            </a>
          </li>
        )}
        <li onClick={() => navigate("/trade", { replace: true })}>Trade</li>
        {login_information.is_logged_in && (
          <li onClick={() => navigate("/reports", { replace: true })}>
            Report
          </li>
        )}
        <li>
          Theme &nbsp;
          <ThemeToggle />
        </li>
        {login_information.is_logged_in && <li onClick={logout}> Sign Out</li>}
      </ul>
      {login_information.is_logged_in ? (
        <button
          class={styles.account_info}
          onClick={() => setshowAccountSwitcher(true)}
        >
          <div class={styles.account_wrapper}>
            <AccountHeader />
          </div>
        </button>
      ) : (
        !login_information.is_logging_in && (
          <div
            onClick={() =>
              (window.location.href = loginUrl({ language: "en" }))
            }
          >
            <b>Log In</b>
          </div>
        )
      )}
    </section>
  );
};

const toggleThemeHandler = (event) => {
  setIsLightTheme(event.target.checked);
};

const ThemeToggle = () => {
  return (
    <label class={styles["switch"]}>
      <input
        type={"checkbox"}
        checked={is_light_theme()}
        onChange={toggleThemeHandler}
      />
      <span class={classNames(styles["slider"], styles["round"])} />
    </label>
  );
};

export default NavBar;
