# StaffManagement

1. Server(api)
	From the Tools menu, select NuGet Package Manager > Manage NuGet Packages for Solution.
	Select the Browse tab.
	Enter Microsoft.EntityFrameworkCore.InMemory in the search box, and then select Microsoft.EntityFrameworkCore.InMemory.
	Select the Project checkbox in the right pane and then select Install.

- Install-Package Microsoft.EntityFrameworkCore.Tools
- dotnet add package Microsoft.EntityFrameworkCore.Sqlite

-dotnet tool install --global dotnet-ef
-dotnet add package Microsoft.EntityFrameworkCore.Design
-dotnet ef migrations add InitialCreate
-dotnet ef database update

2. React (client)

Installation
- npm install
- npm install react-responsive-modal --save
- npm i react-feather

