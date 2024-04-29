using System.ComponentModel.DataAnnotations;

namespace StaffManagement.Server.Models
{
    public class Staff
    {

        [Required]
        [StringLength(8, ErrorMessage = "Staff ID must not exceed 8 characters.")]
        public required string StaffID { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Full name must not exceed 100 characters.")]
        public required string FullName { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Birthday { get; set; }

        [Required]
        [Range(1, 2, ErrorMessage = "Gender must be 1 for Male or 2 for Female.")]
        public int Gender { get; set; }

    }

}
