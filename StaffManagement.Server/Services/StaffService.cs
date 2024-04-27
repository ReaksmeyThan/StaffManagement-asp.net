using Microsoft.EntityFrameworkCore;
using StaffManagement.Server.Connection;
using StaffManagement.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace StaffManagement.Server.Services
{
    public class StaffService
    {
        private readonly AppDbContext _context;

        public StaffService(AppDbContext context)
        {
            _context = context;
        }

        public List<Staff> GetAllStaff()
        {
            return _context.Staffs.ToList();
        }

        public Staff GetStaffById(string staffId)
        {
            return _context.Staffs.FirstOrDefault(s => s.StaffID == staffId);
        }

        public void AddStaff(Staff staff)
        {
            ValidateStaff(staff);

            _context.Staffs.Add(staff);
            _context.SaveChanges();
        }

        public void UpdateStaff(Staff staff)
        {
            ValidateStaff(staff);

            _context.Staffs.Update(staff);
            _context.SaveChanges();
        }

        public void DeleteStaff(string staffId)
        {
            var staff = _context.Staffs.FirstOrDefault(s => s.StaffID == staffId);
            if (staff != null)
            {
                _context.Staffs.Remove(staff);
                _context.SaveChanges();
            }
        }

        public List<Staff> SearchStaff(string ?staffId, int? gender, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Staffs.AsQueryable();

            if (!string.IsNullOrEmpty(staffId))
            {
                query = query.Where(s => s.StaffID.Contains(staffId));
            }

            if (gender.HasValue)
            {
                query = query.Where(s => s.Gender == gender);
            }

            if (fromDate.HasValue && toDate.HasValue)
            {
                query = query.Where(s => s.Birthday >= fromDate && s.Birthday <= toDate);
            }

            return query.ToList();
        }

        private void ValidateStaff(Staff staff)
        {
           
            if (string.IsNullOrEmpty(staff.StaffID) || staff.StaffID.Length > 8)
            {
                throw new ArgumentException("Staff ID cannot be empty and must be less than or equal to 8 characters.");
            }

            if (string.IsNullOrEmpty(staff.FullName) || staff.FullName.Length > 100)
            {
                throw new ArgumentException("Full name cannot be empty and must be less than or equal to 100 characters.");
            }

            if (staff.Gender != 1 && staff.Gender != 2)
            {
                throw new ArgumentException("Invalid gender value. Use 1 for Male and 2 for Female.");
            }
        }
    }
}
