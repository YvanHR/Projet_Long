

import java.io.IOException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class PersistRelationServlet
 */
public class PersistRelationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PersistRelationServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatabaseConnector dc = new DatabaseConnector();
		Statement st = dc.getStatement();
		
		// Get the information to be persisted
		String user = request.getParameter("user");
		String image = request.getParameter("image");
		String representation = request.getParameter("representation");
		int id_obj = Integer.parseInt(request.getParameter("object"));
		String relation = request.getParameter("relation");
		
		try {
			st.executeUpdate("INSERT INTO Relation VALUES(0,'" + user + "','" + image + "','" + representation + "'," + id_obj + ",'" + relation + "');");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

}
