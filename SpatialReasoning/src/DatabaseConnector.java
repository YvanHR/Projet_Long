import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;



public class DatabaseConnector {

	Connection conn;
	
	public DatabaseConnector() {
		createConnexion();
	}
	
	public void createConnexion() {
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		}

		
		String passwd = "root";	
		String username = "root";
		String url = "jdbc:mysql://localhost/spatialreasoning?user="+username+"&password="+passwd;
	
		try {
			this.conn = DriverManager.getConnection(url);
		} catch (SQLException e) {
			e.printStackTrace();
		}
			
	}
	
	public void closeConnexion() {
		try {
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Statement getStatement() {
		Statement res=null;
		try {
			if (conn.isClosed()) createConnexion();
 			res = conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return res;
	}

	public PreparedStatement getPreparedStatement(String query) {
		PreparedStatement res=null;
		try {
			if (conn.isClosed()) createConnexion();
 			res = conn.prepareStatement(query);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return res;
	}

}