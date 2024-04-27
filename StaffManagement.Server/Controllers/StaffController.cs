using Microsoft.AspNetCore.Mvc;
using StaffManagement.Server.Models;
using StaffManagement.Server.Services;
using System;
using System.Collections.Generic;

namespace StaffManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _staffService;

        public StaffController(StaffService staffService)
        {
            _staffService = staffService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Staff>> GetAllStaff()
        {
            try
            {
                return Ok(_staffService.GetAllStaff());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public ActionResult<Staff> GetStaffById(string id)
        {
            try
            {
                var staff = _staffService.GetStaffById(id);
                if (staff == null)
                {
                    return NotFound();
                }
                return Ok(staff);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public ActionResult<Staff> AddStaff(Staff staff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _staffService.AddStaff(staff);
                return CreatedAtAction(nameof(GetStaffById), new { id = staff.StaffID }, staff);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateStaff(string id, Staff staff)
        {
            if (id != staff.StaffID)
            {
                return BadRequest("Staff ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _staffService.UpdateStaff(staff);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStaff(string id)
        {
            try
            {
                _staffService.DeleteStaff(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<Staff>> SearchStaff(string ?staffId, int? gender, DateTime? fromDate, DateTime? toDate)
        {
            try
            {
                var result = _staffService.SearchStaff(staffId, gender, fromDate, toDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
