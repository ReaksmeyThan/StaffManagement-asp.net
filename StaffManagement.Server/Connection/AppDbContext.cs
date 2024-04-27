using Microsoft.EntityFrameworkCore;
using StaffManagement.Server.Models;

namespace StaffManagement.Server.Connection
{
    public class AppDbContext : DbContext
    {
        public DbSet<Staff> Staffs { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=./Data/MyDatabase.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Staff>().ToTable("Staffs");
        }
    }
}
