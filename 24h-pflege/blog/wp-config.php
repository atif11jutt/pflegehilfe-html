<?php
/**
 * Grundeinstellungen für WordPress
 *
 * Diese Datei wird zur Erstellung der wp-config.php verwendet.
 * Du musst aber dafür nicht das Installationsskript verwenden.
 * Stattdessen kannst du auch diese Datei als „wp-config.php“ mit
 * deinen Zugangsdaten für die Datenbank abspeichern.
 *
 * Diese Datei beinhaltet diese Einstellungen:
 *
 * * MySQL-Zugangsdaten,
 * * Tabellenpräfix,
 * * Sicherheitsschlüssel
 * * und ABSPATH.
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL-Einstellungen - Diese Zugangsdaten bekommst du von deinem Webhoster. ** //
/**
 * Ersetze datenbankname_hier_einfuegen
 * mit dem Namen der Datenbank, die du verwenden möchtest.
 */
define( 'DB_NAME', 'dbs4325001' );

/**
 * Ersetze benutzername_hier_einfuegen
 * mit deinem MySQL-Datenbank-Benutzernamen.
 */
define( 'DB_USER', 'dbu1698964' );

/**
 * Ersetze passwort_hier_einfuegen mit deinem MySQL-Passwort.
 */
define( 'DB_PASSWORD', 'zxb_HBV8xat*axc-urq' );

/**
 * Ersetze localhost mit der MySQL-Serveradresse.
 */
define( 'DB_HOST', 'db5005170072.hosting-data.io' );

/**
 * Der Datenbankzeichensatz, der beim Erstellen der
 * Datenbanktabellen verwendet werden soll
 */
define( 'DB_CHARSET', 'utf8mb4' );

/**
 * Der Collate-Type sollte nicht geändert werden.
 */
define('DB_COLLATE', '');

/**#@+
 * Sicherheitsschlüssel
 *
 * Ändere jeden untenstehenden Platzhaltertext in eine beliebige,
 * möglichst einmalig genutzte Zeichenkette.
 * Auf der Seite {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * kannst du dir alle Schlüssel generieren lassen.
 *
 * Du kannst die Schlüssel jederzeit wieder ändern, alle angemeldeten
 * Benutzer müssen sich danach erneut anmelden.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'i=@&;tV(Qe5Rpm0pzd52ls|JXc}[>LX}w;r907RG*aIfj= 2j9fD[7mQWn1-XA2h' );
define( 'SECURE_AUTH_KEY',  'nBn>|&+|vs`a9rnDill(Y9Y3z,C6_BW/-t<CeTw`@c@Y#,i Fa<[[)Il7%x]TOsT' );
define( 'LOGGED_IN_KEY',    'Cp/z_ri.Ta3+Dhm?N]O+hLvO[x$Ml8eh=|}L=<NLj6]+hF{A&4)e}x0|BO3pqY5X' );
define( 'NONCE_KEY',        'CEmh>Oo/[DBN*]>sLrfJyGVJx#W)Nj{|eHbAKt=i|2Ge2H#fRk7MTVQl<@+t+KIt' );
define( 'AUTH_SALT',        '0f~3q28~2 P|&0jf+}yDCjM!?M{fMyZVeW|u|nEQ`Q(gJz5nR;D.1ptA,e~s&og<' );
define( 'SECURE_AUTH_SALT', 'zP629-<z+`xL-ik1Mt3t9$+PQ:W:$S3}9Y*?}3ATC-|2jR3&qGtqWl;z_4lvy!pI' );
define( 'LOGGED_IN_SALT',   'y$Se 2Xz|0wsDyp*F]{q0F@2x3{cFht<i$ZjgwSj$u!HZ!D[W$a>8:Nyp-n]LB]>' );
define( 'NONCE_SALT',       '!pVNy:AUdqEM[|bLT+,,Q(vPFq~YJ9$Mbdb/Y4B@1I6^J~u!ppLAU8eENvHkZ9pi' );

/**#@-*/

/**
 * WordPress Datenbanktabellen-Präfix
 *
 * Wenn du verschiedene Präfixe benutzt, kannst du innerhalb einer Datenbank
 * verschiedene WordPress-Installationen betreiben.
 * Bitte verwende nur Zahlen, Buchstaben und Unterstriche!
 */
$table_prefix = 'wp_';

/**
 * Für Entwickler: Der WordPress-Debug-Modus.
 *
 * Setze den Wert auf „true“, um bei der Entwicklung Warnungen und Fehler-Meldungen angezeigt zu bekommen.
 * Plugin- und Theme-Entwicklern wird nachdrücklich empfohlen, WP_DEBUG
 * in ihrer Entwicklungsumgebung zu verwenden.
 *
 * Besuche den Codex, um mehr Informationen über andere Konstanten zu finden,
 * die zum Debuggen genutzt werden können.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Füge individuelle Werte zwischen dieser Zeile und der „Schluss mit dem Bearbeiten“ Zeile ein. */



/* Das war’s, Schluss mit dem Bearbeiten! Viel Spaß. */
/* That's all, stop editing! Happy publishing. */

/** Der absolute Pfad zum WordPress-Verzeichnis. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Definiert WordPress-Variablen und fügt Dateien ein.  */
require_once ABSPATH . 'wp-settings.php';
